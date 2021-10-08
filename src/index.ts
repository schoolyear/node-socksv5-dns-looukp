// export * from "./Server";
// export * from "./Client";
// export * from "./Auth";

import { Server} from './Server';
import { Auth } from './Auth';

export function SetupProxy(): Server {
    // let dnsCache = new Map();
    return new Server(
        {
        },
        (info, accept, deny) => {
			// console.log("request", info)
            accept().catch((err) => {
				console.log("accept failed with err", err)
			});
        },
    );
}

export function StartProxy(srv: Server): Promise<void> {
    // no login auth is required as this proxy is bound to localhost
    srv.useAuth(Auth.none());

    // wrap the callback in a promise
    const listen = (port: number, hostname: string) => {
        return new Promise<void>((resolve, reject) => {
            srv.listen(port, hostname, () => {
                resolve();
            });
        });
    };

    return listen(8080, 'localhost');
}

const svr = SetupProxy()


svr.on("error", (err)=> {
	console.log("emitted error caught", err)
})


svr.emit("error", "look an error!")


StartProxy(svr).then(() => { console.log("proxy running")})