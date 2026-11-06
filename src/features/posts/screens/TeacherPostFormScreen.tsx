import ActionButton from "@/components/ui/ActionButton";
import LoadingState from "@/components/ui/LoadingState";
import SelectField from "@/components/ui/SelectField";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  colors,
  commonStyles,
  teacherPostFormStyles as styles,
} from "@/features/posts/styles";
import {
  emptyPostValues,
  formatSemesterForApi,
  formatSeriesForApi,
  normalizeSemesterInput,
  normalizeSeriesInput,
  plainText,
  validatePost,
  type FieldErrors,
  type FormField,
} from "@/features/posts/utils/validation";
import { normalizeText } from "@/features/posts/utils/post";
import { useApiClient } from "@/hooks/useApiClient";
import type { IPostValues } from "@/interfaces/IPostValues";
import {
  createPost,
  getDisciplines,
  getPostById,
  getPostStatuses,
  updatePost,
} from "@/services/postsService";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { IDiscipline } from "@/interfaces/IDiscipline";
import type { IPostStatus } from "@/interfaces/IPostStatus";

function resolveParam(param: string | string[] | undefined) {
  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
}

export default function TeacherPostFormScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const postId = resolveParam(rawId);

  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { request } = useApiClient();

  const [values, setValues] = useState<IPostValues>(emptyPostValues);
  const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);
  const [statuses, setStatuses] = useState<IPostStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadForm() {
      setLoading(true);
      setLoadError("");
      setSaveError("");

      try {
        const [availableDisciplines, availableStatuses, post] = await Promise.all([
          getDisciplines(request),
          getPostStatuses(request),
          postId ? getPostById(request, postId) : Promise.resolve(null),
        ]);

        if (!active) {
          return;
        }

        if (post && post.author._id !== user?.id) {
          setLoadError("Você só pode editar os seus próprios posts.");
          return;
        }

        setDisciplines(availableDisciplines);
        setStatuses(availableStatuses);
        setValues(
          post
            ? {
                title: post.title,
                summary: post.summary,
                content: post.content,
                disciplineId: post.discipline._id,
                statusId: post.status._id,
                semester: normalizeSemesterInput(post.semester ?? ""),
                series: normalizeSeriesInput(post.series ?? ""),
                imageUrl: post.imageUrl ?? "",
                isFeatured: post.isFeatured ?? false,
              }
            : { ...emptyPostValues },
        );
      } catch (error: unknown) {
        if (active) {
          setLoadError(
            getRequestError(
              error,
              "Não foi possível carregar o formulário. Tente novamente.",
            ),
          );
          showError("Não foi possível carregar o formulário.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadForm();

    return () => {
      active = false;
    };
  }, [postId, request, showError, user?.id]);

  const availableCatalogs = useMemo(
    () =>
      disciplines.some((item) => item.isActive) &&
      statuses.some(
        (item) => item.isActive && normalizeText(item.label) !== "arquivado",
      ),
    [disciplines, statuses],
  );

  function changeField<K extends FormField>(field: K, value: IPostValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSaveError("");
  }

  async function handleSave() {
    const nextErrors = validatePost(values, disciplines, statuses);
    setErrors(nextErrors);
    setSaveError("");

    if (Object.keys(nextErrors).length > 0) {
      setSaveError("Revise os campos destacados antes de salvar.");
      return;
    }

    const payload: IPostValues = {
      ...values,
      title: plainText(values.title),
      summary: plainText(values.summary),
      content: plainText(values.content),
      semester: formatSemesterForApi(values.semester),
      series: formatSeriesForApi(values.series),
      imageUrl: values.imageUrl.trim(),
    };

    try {
      setSaving(true);

      if (postId) {
        await updatePost(request, postId, payload);
      } else {
        await createPost(request, payload);
      }

      showSuccess(postId ? "Post atualizado com sucesso." : "Post criado com sucesso.");
      router.dismissTo("/teacher/posts" as Href);
    } catch (error: unknown) {
      setSaveError(
        getRequestError(
          error,
          "Não foi possível salvar o post. Seus dados continuam no formulário; tente novamente.",
        ),
      );
      showError("Não foi possível salvar o post.");
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
          label="Voltar para meus posts"
          onPress={() => router.dismissTo("/teacher/posts" as Href)}
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
        contentContainerStyle={[commonStyles.content, { paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headingBlock}>
          <Text style={commonStyles.title}>{postId ? "Editar Post" : "Novo Post"}</Text>
          <Text style={commonStyles.subtitle}>
            {postId
              ? "Atualize o conteúdo e salve suas alterações."
              : "Compartilhe um novo conteúdo com seus alunos."}{" "}
            Campos com * são obrigatórios.
          </Text>
        </View>

        {!availableCatalogs ? (
          <Text style={styles.warning}>
            É necessário ter uma disciplina e um status ativos cadastrados para
            salvar posts.
          </Text>
        ) : null}

        <View style={commonStyles.card}>
          <FormInput
            error={errors.title}
            label="Título *"
            maxLength={100}
            onChangeText={(text) => changeField("title", text)}
            placeholder="Título do conteúdo"
            value={values.title}
          />
          <Text style={styles.counter}>{values.title.length}/100 caracteres</Text>

          <FormInput
            error={errors.summary}
            label="Resumo *"
            maxLength={300}
            multiline
            onChangeText={(text) => changeField("summary", text)}
            placeholder="Uma breve apresentação do post"
            value={values.summary}
          />
          <Text style={styles.counter}>{values.summary.length}/300 caracteres</Text>

          <FormInput
            error={errors.content}
            label="Conteúdo *"
            multiline
            onChangeText={(text) => changeField("content", text)}
            placeholder="Escreva o conteúdo completo do post"
            value={values.content}
          />
          <Text style={styles.hint}>
            Use texto simples. Separe os parágrafos com uma linha em branco.
          </Text>

          <SelectField
            error={errors.disciplineId}
            label="Disciplina *"
            onChange={(value) => changeField("disciplineId", value)}
            options={[
              { label: "Selecione a disciplina", value: "" },
              ...disciplines
                .filter((item) => item.isActive || item._id === values.disciplineId)
                .map((item) => ({
                  label: item.label,
                  value: item._id,
                })),
            ]}
            placeholder="Selecione a disciplina"
            value={values.disciplineId}
          />

          <SelectField
            error={errors.statusId}
            label="Status *"
            onChange={(value) => changeField("statusId", value)}
            options={[
              { label: "Selecione o status", value: "" },
              ...statuses
                .filter(
                  (item) =>
                    (item.isActive || item._id === values.statusId) &&
                    normalizeText(item.label) !== "arquivado",
                )
                .map((item) => ({
                  label: item.label,
                  value: item._id,
                })),
            ]}
            placeholder="Selecione o status"
            value={values.statusId}
          />

          <FormInput
            error={errors.semester}
            label="Semestre *"
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, "");

              if (!digits) {
                changeField("semester", "");
                return;
              }

              const numeric = Number.parseInt(digits, 10);
              changeField(
                "semester",
                Number.isInteger(numeric) && numeric >= 1 && numeric <= 4
                  ? String(numeric)
                  : "",
              );
            }}
            placeholder="Digite um número de 1 a 4"
            value={values.semester}
          />

          <FormInput
            error={errors.series}
            keyboardType="number-pad"
            label="Série / Ano (opcional)"
            maxLength={1}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, "");

              if (!digits) {
                changeField("series", "");
                return;
              }

              const numeric = Number.parseInt(digits, 10);
              changeField(
                "series",
                Number.isInteger(numeric) && numeric >= 1 && numeric <= 9
                  ? String(numeric)
                  : "",
              );
            }}
            placeholder="Digite um número de 1 a 9"
            value={values.series}
          />

          <FormInput
            autoCapitalize="none"
            error={errors.imageUrl}
            keyboardType="url"
            label="URL da imagem de capa (opcional)"
            onChangeText={(text) => changeField("imageUrl", text)}
            placeholder="https://exemplo.com/imagem.jpg"
            value={values.imageUrl}
          />
          <Text style={styles.hint}>
            Deixe em branco para salvar sem imagem de capa.
          </Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Marcar post como destaque</Text>
            <Switch
              accessibilityLabel="Marcar post como destaque"
              onValueChange={(checked) => changeField("isFeatured", checked)}
              thumbColor={values.isFeatured ? colors.teal : undefined}
              trackColor={{ true: "#99f6e4", false: "#cbd5e1" }}
              value={values.isFeatured}
            />
          </View>

          {saveError ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {saveError}
            </Text>
          ) : null}

          <View style={styles.buttons}>
            <ActionButton
              label="Cancelar"
              onPress={() => router.dismissTo("/teacher/posts" as Href)}
              variant="secondary"
            />
            <ActionButton
              disabled={!availableCatalogs}
              label={postId ? "Salvar alterações" : "Criar post"}
              loading={saving}
              onPress={() => void handleSave()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  maxLength,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  keyboardType?: "default" | "url" | "number-pad";
  autoCapitalize?: "none" | "sentences";
}) {
  return (
    <View>
      <Text style={localStyles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[
          commonStyles.input,
          multiline && styles.multiline,
          error && styles.invalid,
        ]}
        textAlignVertical={multiline ? "top" : "center"}
        value={value}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function getRequestError(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("status" in error)) {
    return fallback;
  }

  const status = Number((error as { status?: number }).status);

  if (status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar.";
  }

  if (status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }

  if (status === 404) {
    return "Post, disciplina ou status não encontrado. O cadastro pode ter sido removido.";
  }

  return fallback;
}

const localStyles = StyleSheet.create({
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
});
