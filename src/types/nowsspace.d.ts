import type { ComponentType } from "react";
import type { UserPublic } from "./users";

declare module "nowsspace" {
    type Props = {
        SDK_URL: string;
        WS_URL: string;
        user: UserPublic | null;
    }

    export const AppOverlay: ComponentType<Props>;
    export default AppOverlay;
}
