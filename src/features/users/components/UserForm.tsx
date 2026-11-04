import ActionButton from "@/components/ui/ActionButton";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import { commonStyles } from "@/features/posts/styles";
import { teacherUserFormStyles as styles } from "@/features/users/styles";
import { IUserFormProps } from "@/interfaces/IUser";
import { UserStatus } from "@/types/UserStatus";
import { Text, View } from "react-native";

const STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: "Ativo", value: "ATIVO" },
  { label: "Inativo", value: "INATIVO" },
];

export default function UserForm({
  role,
  values,
  errors,
  isEditing,
  canChangeStatus,
  isSaving,
  submitError,
  onChange,
  onSubmit,
  onCancel,
}: IUserFormProps) {
  const label = role === "PROFESSOR" ? "professor" : "aluno";

  return (
    <View style={commonStyles.card}>
      <FormField
        autoCapitalize="words"
        editable={!isSaving}
        error={errors.name}
        label="Nome *"
        onChangeText={(text) => onChange("name", text)}
        placeholder="Nome completo"
        value={values.name}
      />

      <FormField
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSaving}
        error={errors.username}
        label="Nome de usuário *"
        onChangeText={(text) => onChange("username", text)}
        placeholder="nome.usuario"
        value={values.username}
      />

      <FormField
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSaving}
        error={errors.email}
        keyboardType="email-address"
        label="E-mail *"
        onChangeText={(text) => onChange("email", text)}
        placeholder="email@exemplo.com"
        value={values.email}
      />

      <FormField
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSaving}
        error={errors.password}
        hint={
          isEditing
            ? "Deixe em branco para manter a senha atual."
            : "Mínimo de 6 caracteres."
        }
        isPassword
        label={isEditing ? "Senha (opcional)" : "Senha *"}
        onChangeText={(text) => onChange("password", text)}
        placeholder={isEditing ? "Nova senha" : "Senha de acesso"}
        value={values.password}
      />

      <SelectField
        disabled={isSaving || !canChangeStatus}
        hint={
          canChangeStatus
            ? `Um ${label} inativo não consegue entrar no aplicativo.`
            : "Você não pode inativar o seu próprio cadastro."
        }
        label="Status *"
        onChange={(value) => onChange("status", value as UserStatus)}
        options={STATUS_OPTIONS}
        placeholder="Selecione o status"
        value={values.status}
      />

      {submitError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {submitError}
        </Text>
      ) : null}

      <View style={styles.buttons}>
        <ActionButton
          disabled={isSaving}
          label="Cancelar"
          onPress={onCancel}
          variant="secondary"
        />
        <ActionButton
          label={isEditing ? "Salvar alterações" : `Cadastrar ${label}`}
          loading={isSaving}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
}
