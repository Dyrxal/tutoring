export type Theme = 'light' | 'midnight';

/** Server values are deliberately stricter than the historical browser value. */
export function normalizeStudentTheme(value: unknown): Theme | null {
 return value === 'light' || value === 'midnight' ? value : null;
}

export function isStudentThemeScreen(theme: Theme, role: string | null | undefined, page: string): boolean {
 return theme === 'midnight' && role === 'student' && ['dashboard', 'courses', 'progress', 'account'].includes(page);
}
