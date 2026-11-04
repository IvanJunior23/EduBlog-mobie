import ActionButton from "@/components/ui/ActionButton";
import LoadingState from "@/components/ui/LoadingState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { commonStyles } from "@/features/posts/styles";
import UserForm from "@/features/users/components/UserForm";
import { USER_ROLE_CONFIG } from "@/features/users/constants/userRoleConfig";
import { teacherUserFormStyles as styles } from "@/features/users/styles";
import { resolveUserRole } from "@/features/users/utils/user";
import { validateUserForm } from "@/features/users/utils/validation";
import { useApiClient } from "@/hooks/useApiClient";
import { ITeacherUserFormScreenProps, IUserFormValues } from "@/interfaces/IUser";
import { createUser, getUsers, updateUser } from "@/services/usersService";
import type {
  UserFormErrors,
  UserFormField,
} from "@/features/users/utils/validation";
import { getRequestErrorMessage } from "@/utils/apiError";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const emptyValues: IUserFormValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  status: "ATIVO",
};

function resolveParam(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
}

export default function TeacherUserFormScreen({
  role,
}: ITeacherUserFormScreenProps) {
  const config = USER_ROLE_CONFIG[role];

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const userId = resolveParam(rawId);
  const isEditing = Boolean(userId);

  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { request } = useApiClient();

  const canChangeStatus = !userId || userId !== currentUser?.id;

  const [values, setValues] = useState<IUserFormValues>(emptyValues);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!userId) {
      return;
    }

    let active = true;

    async function loadUser() {
      try {
        const users = await getUsers(request);

        if (!active) {
          return;
        }

        const user = users.find((item) => item._id === userId);

        if (!user || resolveUserRole(user) !== role) {
          setLoadError("Cadastro não encontrado. Ele pode ter sido removido.");
          return;
        }

        setValues({
          name: user.name,
          username: user.username,
          email: user.email,
          password: "",
          status: user.isActive ? "ATIVO" : "INATIVO",
        });
      } catch (error: unknown) {
        if (active) {
          setLoadError(
            getRequestErrorMessage(
              error,
              "Não foi possível carregar os dados. Tente novamente.",
            ),
          );
          showError("Não foi possível carregar os dados.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, [userId, role, request, showError]);

  function goBackToList() {
    router.dismissTo(config.listHref);
  }

  function changeField<F extends UserFormField>(
    field: F,
    value: IUserFormValues[F],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaveError("");
  }

  async function handleSave() {
    if (saving) {
      return;
    }

    const nextErrors = validateUserForm(values, isEditing);
    setErrors(nextErrors);
    setSaveError("");

    if (Object.keys(nextErrors).length > 0) {
      setSaveError("Revise os campos destacados antes de salvar.");
      return;
    }

    const name = values.name.trim();
    const username = values.username.trim();
    const email = values.email.trim();

    try {
      setSaving(true);

      if (userId) {
        await updateUser(request, userId, {
          name,
          username,
          email,
          ...(canChangeStatus ? { isActive: values.status === "ATIVO" } : {}),
          ...(values.password ? { password: values.password } : {}),
        });
      } else {
        await createUser(request, {
          name,
          username,
          email,
          password: values.password,
          role,
          isActive: values.status === "ATIVO",
        });
      }

      showSuccess(
        isEditing
          ? `O ${config.singular} foi atualizado com sucesso.`
          : `O ${config.singular} foi cadastrado com sucesso.`,
      );
      goBackToList();
    } catch (error: unknown) {
      setSaveError(
        getRequestErrorMessage(
          error,
          `Não foi possível salvar o ${config.singular}. Seus dados continuam no formulário; tente novamente.`,
        ),
      );
      showError(`Não foi possível salvar o ${config.singular}.`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando formulário..." />;
  }

  if (loadError) {
    return (
      <View style={[commonStyles.card, styles.loadError]}>
        <Text style={styles.heading}>Formulário indisponível</Text>
        <Text style={styles.errorText}>{loadError}</Text>
        <ActionButton
          label={`Voltar para ${config.plural}`}
          onPress={goBackToList}
          variant="secondary"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.page}
    >
      <ScrollView
        contentContainerStyle={[
          commonStyles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headingBlock}>
          <Text style={commonStyles.title}>
            {isEditing ? config.editTitle : config.createTitle}
          </Text>
          <Text style={commonStyles.subtitle}>
            {isEditing
              ? `Atualize os dados do ${config.singular} e salve as alterações.`
              : `Preencha os dados para cadastrar um novo ${config.singular}.`}{" "}
            Campos com * são obrigatórios.
          </Text>
        </View>

        <UserForm
          canChangeStatus={canChangeStatus}
          errors={errors}
          isEditing={isEditing}
          isSaving={saving}
          onCancel={goBackToList}
          onChange={changeField}
          onSubmit={() => void handleSave()}
          role={role}
          submitError={saveError}
          values={values}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
