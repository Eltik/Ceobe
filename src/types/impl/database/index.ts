export type FieldType = "TEXT" | "INTEGER" | "DECIMAL" | "BOOLEAN" | "JSONB" | "TIMESTAMP";

export type ConstraintOptions = {
    foreignKey?: {
        table: string; // The referenced table
        field: string; // The referenced field (e.g., "id")
        onDelete?: "SET NULL" | "CASCADE" | "RESTRICT" | "NO ACTION"; // Optional delete behavior
    };
};

export type FieldOptions = {
    primaryKey?: boolean;
    notNull?: boolean;
    default?: string | number | boolean;
    check?: string;
    unique?: boolean;
    constraints?: ConstraintOptions;
};

export type TableField = {
    type: FieldType;
    options?: FieldOptions;
};

export type Schema = {
    [fieldName: string]: TableField;
};

export type SchemaToInput<S extends Schema> = {
    [K in keyof S as S[K]["options"] extends { primaryKey: true }
        ? never // Skip primary key since it's auto-generated
        : S[K]["options"] extends { notNull: true }
          ? K
          : K]?: any;
};

export type SchemaToUpdateInput<S extends Schema> = {
    [K in keyof S as S[K]["options"] extends { primaryKey: true } ? never : K]?: any;
};
