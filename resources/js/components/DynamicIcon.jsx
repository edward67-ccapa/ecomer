import React from 'react';
import * as FaIcons from 'react-icons/fa6';
import * as FaLegacy from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as HiIcons from 'react-icons/hi2';
import * as BiIcons from 'react-icons/bi';
import * as FiIcons from 'react-icons/fi';
import * as IoIcons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as LuIcons from 'react-icons/lu';
import * as CgIcons from 'react-icons/cg';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as TbIcons from 'react-icons/tb';
import * as PiIcons from 'react-icons/pi';
import * as RxIcons from 'react-icons/rx';
import * as CiIcons from 'react-icons/ci';
import * as GrIcons from 'react-icons/gr';

const iconPacks = [
    FaIcons,
    FaLegacy,
    MdIcons,
    HiIcons,
    BiIcons,
    FiIcons,
    IoIcons,
    BsIcons,
    LuIcons,
    CgIcons,
    AiIcons,
    RiIcons,
    SiIcons,
    TbIcons,
    PiIcons,
    RxIcons,
    CiIcons,
    GrIcons,
];

export default function DynamicIcon({ name, className = "w-6 h-6", size, color, ...props }) {
    if (!name || typeof name !== 'string') return null;

    const trimmedName = name.trim();

    // 1. Buscar coincidencia exacta en los paquetes de iconos
    for (const pack of iconPacks) {
        const IconComponent = pack[trimmedName];
        if (IconComponent) {
            return <IconComponent className={className} size={size} color={color} {...props} />;
        }
    }

    // 2. Coincidencia insensible a mayúsculas
    for (const pack of iconPacks) {
        const matchingKey = Object.keys(pack).find(
            (k) => k.toLowerCase() === trimmedName.toLowerCase()
        );
        if (matchingKey) {
            const IconComponent = pack[matchingKey];
            return <IconComponent className={className} size={size} color={color} {...props} />;
        }
    }

    return null;
}
