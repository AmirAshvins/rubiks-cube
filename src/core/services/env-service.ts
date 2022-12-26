/**
 * The interface that is used to keep the variables used in the .env file or any env related functionality.
 */
class EnvService {

    /**
     * The Public Url of the application.
     */
    static PublicUrl: string = process.env.PUBLIC_URL ?? "";

    /**
     * Determines if the current environment is development.
     */
    static isDevelopment: boolean = process.env.NODE_ENV === 'development';

    /**
     * Determines if the current environment is Test.
     */
    static isTest: boolean = process.env.NODE_ENV === 'test';

    /**
     * Determines if the current environment is production.
     */
    static isProduction: boolean = process.env.NODE_ENV === 'production';

    /**
     * Title of the application
     */
    static title: string = process.env.REACT_APP_WEBSITE_NAME ?? ''

    /**
     * Description of the application
     */
    static description: string = process.env.REACT_APP_WEBSITE_DESCRIPTION ?? ''
}

export default EnvService;
