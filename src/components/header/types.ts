export type MenuLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type MenuSection = {
  label: string;
  href?: string;
  children?: MenuLink[];
};


