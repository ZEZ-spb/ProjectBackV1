import {ExpressMiddlewareInterface, Middleware} from "routing-controllers";
import {NextFunction, Request, Response} from "express";

export class AuthorizationMiddleware implements ExpressMiddlewareInterface {
    async use(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const body = request.body.user;
            const hasRoleAdministrator = body.roles.some((role:string)=> "administrator" === role.toLowerCase());
            const hasRoleModerator = body.roles.some((role:string)=> "moderator" === role.toLowerCase());
            let match = request.url.match(new RegExp("/account/user/.*/role/.*"));
            if((request.method === "PUT" ||  request.method === "DELETE") && match ){
                if(!hasRoleAdministrator){
                    return response.status(403).json({message: "No permissions"});
                }
            }
            match = request.url.match(new RegExp("/account/user/.*"));
            if((request.method === "DELETE") && match ){
                const user = request.url.split("/")[3];
                const hasOwner = user === body.login;
                if(!hasRoleAdministrator && !hasOwner){
                    return response.status(403).json({message: "No permissions"});
                }
            }
            match = request.url.match(new RegExp("/forum/post/.*"));
            if((request.method === "DELETE") && match ){
                const postId = request.url.split("/")[3];
                //TODO
                // const hasOwner = user === body.login;
                if(!hasRoleModerator){

                }
            }
            next();
        } catch (error) {
            return response.status(500).json({message: "Server error"});
        }
    }
}