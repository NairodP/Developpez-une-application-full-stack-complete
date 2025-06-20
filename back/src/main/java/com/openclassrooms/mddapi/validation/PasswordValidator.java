package com.openclassrooms.mddapi.validation;

import java.util.regex.Pattern;

public class PasswordValidator {
    
    private static final Pattern DIGIT_PATTERN = Pattern.compile(".*\\d.*");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile(".*[a-z].*");
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(".*[A-Z].*");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(".*[#?!@$%^&*-].*");
    private static final int MIN_LENGTH = 8;
    private static final String VALIDATION_MESSAGE = "Le mot de passe doit contenir au moins 8 caractères, une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (#?!@$%^&*-)";
    
    private PasswordValidator() {
        // Constructeur privé pour empêcher l'instanciation
    }
    
    public static boolean isValid(String password) {
        if (password == null || password.length() < MIN_LENGTH) {
            return false;
        }
        
        return DIGIT_PATTERN.matcher(password).matches()
                && LOWERCASE_PATTERN.matcher(password).matches()
                && UPPERCASE_PATTERN.matcher(password).matches()
                && SPECIAL_CHAR_PATTERN.matcher(password).matches();
    }
    
    public static String getValidationMessage() {
        return VALIDATION_MESSAGE;
    }
}
