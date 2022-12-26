import {generatePath} from "react-router-dom";
import {Params} from "react-router";

/**
 * The map of all the available AppRoutes in the system
 */
class AppRoutes {
    /**
     * Base route
     */
    static landing = '/';

    /**
     * Generates the path of the given AppRoutes in the system that include route parameters.
     * @param {string} route
     * @param {Record<string, string | number>} params
     * @return {string} the generated path
     */
    static generateRoute(route: string, params?: Params | undefined): string {
        return generatePath(route, params)
    }
}

export default AppRoutes;
