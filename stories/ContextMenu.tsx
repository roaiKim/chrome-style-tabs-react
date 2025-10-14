import { Item, Menu, Separator, useContextMenu } from "react-contexify";
import { ChromeFilled } from "@ant-design/icons";

import "react-contexify/ReactContexify.css";
export enum ContextMenuType {
    close = "close",
    refresh = "refresh",
    closeOther = "closeOther",
    closeAll = "closeAll",
    closeRight = "closeRight",
    closeLeft = "closeLeft",
}

export const ContextMenu: React.FC<{ contextMenuClick: (e: any) => void; menuId: string }> = ({ contextMenuClick, menuId }) => {
    return (
        <Menu className="tab-hader-right-menu" preventDefaultOnKeydown={false} id={menuId}>
            <Item data={ContextMenuType.close} onClick={contextMenuClick}>
                <span className="right-click-menu-text">Close</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.refresh} onClick={contextMenuClick}>
                <span className="right-click-menu-text">refresh</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeOther} onClick={contextMenuClick}>
                <span className="right-click-menu-text">Close Others</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeAll} onClick={contextMenuClick}>
                <span className="right-click-menu-text">Close All</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeRight} onClick={contextMenuClick}>
                <span className="right-click-menu-text">Close to the Right</span>
            </Item>
            <Separator />
            <Item data={ContextMenuType.closeLeft} onClick={contextMenuClick}>
                <span className="right-click-menu-text">Close to the Left</span>
            </Item>
        </Menu>
    );
};
