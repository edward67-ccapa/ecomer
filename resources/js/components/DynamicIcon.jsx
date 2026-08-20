import React from 'react';

// 1. FontAwesome 6 (fa6)
import {
    FaWhatsapp,
    FaInstagram,
    FaFacebook,
    FaTiktok,
    FaYoutube,
    FaXTwitter,
    FaEnvelope,
    FaPhone,
    FaLocationDot,
    FaGlobe,
    FaHouseFlag,
    FaStore,
    FaTruck,
    FaTruckFast,
    FaClock,
    FaCalendarDays,
    FaShieldHalved,
    FaBox,
    FaRoute,
    FaMapPin,
    FaCartShopping,
    FaBagShopping,
    FaTag,
    FaTags,
    FaCreditCard,
    FaMoneyBillWave,
    FaGift,
    FaReceipt,
    FaPercent,
    FaBoxOpen,
    FaCoins,
    FaCookieBite,
    FaCookie,
    FaIceCream,
    FaBreadSlice,
    FaMugHot,
    FaUtensils,
    FaBurger,
    FaPizzaSlice,
    FaBowlFood,
    FaAppleWhole,
    FaWineGlass,
    FaStar,
    FaRegStar,
    FaHeart,
    FaRegHeart,
    FaAward,
    FaMedal,
    FaCircleCheck,
    FaThumbsUp,
    FaCrown,
    FaGem,
    FaCertificate,
    FaWrench,
    FaFire,
    FaMagnifyingGlass,
    FaUser,
    FaRegUser,
    FaBars,
    FaXmark,
    FaChevronDown,
    FaChevronRight,
    FaChevronLeft,
    FaChevronUp,
    FaArrowRight,
    FaPlus,
    FaMinus,
    FaTrash,
    FaPenToSquare,
    FaFilter,
    FaShareNodes,
    FaCircleInfo,
    FaCircleQuestion,
    FaEye,
    FaLock,
    FaChartLine,
    FaBriefcase,
    FaBuilding,
    FaHandshake,
    FaUsers,
    FaBullhorn,
    FaHeadphones
} from 'react-icons/fa6';

// 2. FontAwesome Legacy (fa) - alias para retrocompatibilidad
import {
    FaCoffee,
    FaShoppingCart,
    FaShoppingBag,
    FaAppleAlt
} from 'react-icons/fa';

// 3. Heroicons 2 (hi2)
import {
    HiOutlineCake,
    HiOutlineShoppingBag,
    HiOutlineTruck,
    HiOutlineHeart,
    HiOutlineSparkles,
    HiOutlineHome,
    HiOutlineTag,
    HiOutlineGift,
    HiOutlineMapPin,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineUser,
    HiOutlineStar,
    HiOutlineShieldCheck,
    HiOutlineClock
} from 'react-icons/hi2';

// 4. Tabler Icons (tb)
import {
    TbTruckDelivery,
    TbDiscount,
    TbCake,
    TbChefHat,
    TbShoppingBag,
    TbBrandWhatsapp,
    TbPackage,
    TbSparkles,
    TbBuildingStore,
    TbReceiptTax,
    TbCategory,
    TbRosetteDiscountCheck
} from 'react-icons/tb';

// 5. Phosphor Icons (pi)
import {
    PiPaintBrushHouseholdBold,
    PiCakeBold,
    PiShoppingBagBold,
    PiTruckBold,
    PiStorefrontBold,
    PiGiftBold,
    PiTagBold,
    PiHeartBold,
    PiStarBold,
    PiHandbagBold
} from 'react-icons/pi';

// 6. Material Design Icons (md)
import {
    MdOutlineLocalShipping,
    MdOutlineFastfood,
    MdOutlineCake,
    MdOutlineStorefront,
    MdOutlineVerified,
    MdOutlinePayments,
    MdOutlineSupportAgent,
    MdOutlineDiscount
} from 'react-icons/md';

// Diccionario de ~110 iconos específicos seleccionados para alto rendimiento y cero lag
export const iconsMap = {
    // Contacto y Redes Sociales
    FaWhatsapp,
    FaInstagram,
    FaFacebook,
    FaTiktok,
    FaYoutube,
    FaXTwitter,
    FaEnvelope,
    FaPhone,
    FaLocationDot,
    FaGlobe,
    FaHouseFlag,
    FaStore,
    TbBrandWhatsapp,
    HiOutlineEnvelope,
    HiOutlinePhone,

    // Comida, Pastelería y Repostería
    HiOutlineCake,
    PiCakeBold,
    TbCake,
    FaCookieBite,
    FaCookie,
    FaIceCream,
    FaBreadSlice,
    FaCoffee,
    FaMugHot,
    FaUtensils,
    FaBurger,
    FaPizzaSlice,
    FaBowlFood,
    FaAppleAlt,
    FaAppleWhole,
    FaWineGlass,
    TbChefHat,
    MdOutlineCake,
    MdOutlineFastfood,

    // E-commerce, Compras y Ofertas
    FaShoppingCart,
    FaCartShopping,
    FaShoppingBag,
    FaBagShopping,
    HiOutlineShoppingBag,
    TbShoppingBag,
    FaTag,
    FaTags,
    FaCreditCard,
    FaMoneyBillWave,
    FaGift,
    FaReceipt,
    FaPercent,
    TbDiscount,
    FaBoxOpen,
    FaCoins,
    PiStorefrontBold,
    MdOutlinePayments,
    MdOutlineDiscount,
    HiOutlineTag,
    HiOutlineGift,
    PiHandbagBold,

    // Envíos, Logística y Horarios
    TbTruckDelivery,
    FaTruck,
    FaTruckFast,
    MdOutlineLocalShipping,
    FaClock,
    FaCalendarDays,
    FaShieldHalved,
    MdOutlineVerified,
    TbRosetteDiscountCheck,
    FaBox,
    TbPackage,
    FaRoute,
    FaMapPin,
    HiOutlineShieldCheck,
    HiOutlineClock,

    // Calidad, Badges y Reacciones
    PiPaintBrushHouseholdBold,
    FaStar,
    FaRegStar,
    FaHeart,
    FaRegHeart,
    FaAward,
    FaMedal,
    FaCircleCheck,
    FaThumbsUp,
    FaCrown,
    TbSparkles,
    HiOutlineSparkles,
    FaGem,
    FaCertificate,
    FaWrench,
    FaFire,

    // Interfaz y Navegación
    FaMagnifyingGlass,
    FaUser,
    FaRegUser,
    FaBars,
    FaXmark,
    FaChevronDown,
    FaChevronRight,
    FaChevronLeft,
    FaChevronUp,
    FaArrowRight,
    FaPlus,
    FaMinus,
    FaTrash,
    FaPenToSquare,
    FaFilter,
    FaShareNodes,
    FaCircleInfo,
    FaCircleQuestion,
    FaEye,
    FaLock,

    // Negocios y Soporte
    FaChartLine,
    FaBriefcase,
    FaBuilding,
    FaHandshake,
    FaUsers,
    FaBullhorn,
    FaHeadphones,
    MdOutlineSupportAgent
};

export const AVAILABLE_ICONS = Object.keys(iconsMap);

export default function DynamicIcon({ name, className = "w-6 h-6", size, color, ...props }) {
    if (!name || typeof name !== 'string') return null;

    const trimmedName = name.trim();

    // 1. Busqueda en el mapa exacto (O(1) instantáneo)
    let IconComponent = iconsMap[trimmedName];

    // 2. Si no coincide el case exacto, fallback insensible a mayúsculas
    if (!IconComponent) {
        const lowerName = trimmedName.toLowerCase();
        const foundKey = Object.keys(iconsMap).find(k => k.toLowerCase() === lowerName);
        if (foundKey) {
            IconComponent = iconsMap[foundKey];
        }
    }

    if (IconComponent) {
        return <IconComponent className={className} size={size} color={color} {...props} />;
    }

    return null;
}


