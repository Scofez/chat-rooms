import Cookies from 'js-cookie';

import queryHandler from './QueryHandler';

interface AuthResponse {
    message: string;
    token: string;
}

class AuthQueryHandler {
    private readonly TOKEN_KEY = 'auth_token';

    /**
     * Sets the token in a cookie
     * 
     * @param {string} token the token to set
     */
    public setToken(token: string): void {
        Cookies.set(this.TOKEN_KEY, token, { expires: 1, secure: true, sameSite: 'strict' });
    }

    /**
     * Gets the token from a cookie
     * 
     * @returns {string | undefined} the token
     */
    public getToken(): string | undefined {
        return Cookies.get(this.TOKEN_KEY);
    }

    /**
     * Removes the token from a cookie
     */
    public removeToken(): void{
        Cookies.remove(this.TOKEN_KEY);
    }

    /**
     * Checks if the user is authenticated
     * 
     * @returns {boolean} true if authenticated, false otherwise
     */
    public isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        return true;
    }

    //TODO: make is so that cookies deletion is also handles in the backend
    //so far cookies are not being hanled in the backend
    /**
     * Logs out a user
     */
    public logout(): void {
        this.removeToken();
    }

    /**
     * Logs in a user
     * 
     * @param {string} username the username
     * @param {string} password the password
     * 
     * @returns {Promise<AuthResponse>} the response
     */
    public async login(username: string, password: string): Promise<AuthResponse> {
        const response = await queryHandler.query<AuthResponse>('/security/login', 'POST', { username, password });
        this.setToken(response.token);
        return response;
    }

    /**
     * Registers a user
     * 
     * @param {string} username the username
     * @param {string} password the password
     * 
     * @returns {Promise<AuthResponse>} the response
     */
    public async register(username: string, password: string): Promise<AuthResponse> {
        const response = await queryHandler.query<AuthResponse>('/security/register', 'POST', { username, password });
        this.setToken(response.token);
        return response;
    }

 }

export default new AuthQueryHandler();