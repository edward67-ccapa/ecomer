<?php
/**
 * Script de autoreparación de Storage y Permisos para cPanel (Sin Terminal)
 * Lismercorp / CCapa
 */

// Seguridad básica o clave opcional si se desea, pero para reparación inicial:
header('Content-Type: text/html; charset=utf-8');

$baseDir = dirname(__DIR__); // Raíz del proyecto Laravel

echo "<h2>🔧 Reparador Automático de Storage y Permisos - Laravel cPanel</h2>";

$folders = [
    $baseDir . '/storage',
    $baseDir . '/storage/app',
    $baseDir . '/storage/app/public',
    $baseDir . '/storage/framework',
    $baseDir . '/storage/framework/views',
    $baseDir . '/storage/framework/sessions',
    $baseDir . '/storage/framework/cache',
    $baseDir . '/storage/framework/cache/data',
    $baseDir . '/storage/logs',
    $baseDir . '/bootstrap/cache',
];

echo "<ul>";
foreach ($folders as $folder) {
    $shortName = str_replace($baseDir, '', $folder);
    if (!file_exists($folder)) {
        if (@mkdir($folder, 0775, true)) {
            echo "<li style='color:green'>✔ Creada carpeta faltante: <b>{$shortName}</b> (Permisos 775)</li>";
        } else {
            echo "<li style='color:red'>✖ Error creando carpeta: <b>{$shortName}</b></li>";
        }
    } else {
        @chmod($folder, 0775);
        echo "<li style='color:blue'>✔ Carpeta existente verificada: <b>{$shortName}</b> (Permisos 775)</li>";
    }
}
echo "</ul>";

// Enlace simbólico storage
$target = $baseDir . '/storage/app/public';
$link = $baseDir . '/public/storage';

echo "<h3>🔗 Enlace simbólico public/storage:</h3>";
if (file_exists($link)) {
    echo "<p style='color:blue'>✔ El enlace o carpeta <b>public/storage</b> ya existe.</p>";
} else {
    if (@symlink($target, $link)) {
        echo "<p style='color:green'>✔ Enlace simbólico <b>public/storage</b> creado exitosamente.</p>";
    } else {
        echo "<p style='color:orange'>⚠ No se pudo crear symlink automático (normal en algunos cPanel compartidos). Si tus imágenes no cargan, copia el contenido de storage/app/public a public/storage.</p>";
    }
}

// Limpiar archivos de caché viejos en bootstrap/cache
$cacheFiles = [
    $baseDir . '/bootstrap/cache/config.php',
    $baseDir . '/bootstrap/cache/routes-v7.php',
];
foreach ($cacheFiles as $cf) {
    if (file_exists($cf)) {
        @unlink($cf);
        echo "<p style='color:green'>✔ Caché limpiada: " . basename($cf) . "</p>";
    }
}

echo "<hr><h3 style='color:green'>🎉 ¡Listo! Carpetas y permisos reparados. Ya puedes volver a entrar a tu página: <a href='/'>Ir al Inicio</a></h3>";
echo "<p style='color:gray'><small>Nota de seguridad: Después de que tu web funcione, puedes borrar este archivo fix.php desde el Administrador de Archivos de cPanel.</small></p>";
