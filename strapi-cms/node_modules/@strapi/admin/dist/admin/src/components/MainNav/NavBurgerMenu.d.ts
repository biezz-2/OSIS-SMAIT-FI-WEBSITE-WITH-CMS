import { MenuItem } from '../../core/apis/router';
interface NavBurgerMenuProps {
    isShown: boolean;
    listLinks: MenuItem[];
    handleClickOnLink: (value: string) => void;
    mobile?: boolean;
    onClose: () => void;
}
export declare const NavBurgerMenu: ({ isShown, handleClickOnLink, onClose, listLinks, }: NavBurgerMenuProps) => import("react/jsx-runtime").JSX.Element;
export {};
