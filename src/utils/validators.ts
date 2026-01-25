// Validação de CPF
export function validateCPF(cpf: string): boolean {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
        return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
}

// Validação de email
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de telefone
export function validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
}

// Validação de senha forte
export function validateStrongPassword(password: string): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Senha deve ter no mínimo 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Senha deve conter letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Senha deve conter letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Senha deve conter número');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}
