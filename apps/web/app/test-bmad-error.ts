// Intentional TypeScript error to test BMAD auto-fix
export const testNumber: number = "this is not a number"; // TypeScript error!

export function brokenFunction(): string {
    return 123; // Wrong return type!
}

// Missing import
export const result = someUndefinedFunction(); // Reference error!

console.log("This file has intentional errors for BMAD testing");