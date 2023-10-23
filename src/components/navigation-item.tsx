import React from 'react';

export interface NavigationItemProps {
  title: string;
  href: string;
  isActive?: boolean;
}

export default function NavigationItem({ title, href, isActive = false }: NavigationItemProps) {
  const customStyle = isActive
    ? 'text-gray-900 font-bold'
    : 'text-gray-600 hover:text-gray-900 hover:text-underline';

  return (
    <li>
      <a className={`inline-block py-2 px-2 ${customStyle} no-underline`} href={href}>
        {title}
      </a>
    </li>
  );
}
