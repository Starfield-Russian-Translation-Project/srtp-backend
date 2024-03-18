declare namespace NodeJS
{
    export interface ProcessEnv
    {
        DB_CONFIG: string;
        DB_NAME: string;
        PORT: string;
        JWT_SECRET: string;
    }
}