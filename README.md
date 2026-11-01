# MER · DER · Base de Datos · Dia — Curso interactivo

Curso en HTML + CSS + JS, sin dependencias ni instalación, para aprender el
camino completo: **Modelo Entidad-Relación → Diagrama relacional → Base de
datos MySQL → programa Dia**.

## Estructura

| Página | Contenido |
|--------|-----------|
| `index.html` | Portada del curso y accesos a los cuatro temas |
| `mer.html` | MER: simbología completa, cardinalidades y ejemplos |
| `der.html` | DER: tablas con PK / FK / AUTO_INCREMENT y paso del MER al DER |
| `mysql.html` | Crear la base, insertar datos, consultar, relaciones y consultas de varias tablas |
| `dia.html` | Uso del programa Dia: pantalla, hoja ER, hoja Database y exportación |
| `guia_completa.html` | Guía completa original de una sola página (material de consulta) |
| `guia_anterior.html` | Versión anterior de la guía de una sola página (se conserva por historial) |

`estilos.css` y `app.js` son compartidos por las cinco páginas del curso.

## Ejercicios

- Cada tema trae teoría y ejercitación en pestañas separadas.
- La corrección es automática y se hace en la misma página: no hay descargas
  ni subidas de archivos.
- El corrector revisa la **estructura** de la respuesta (palabras clave,
  tablas, columnas, cláusulas). **No ejecuta SQL** ni se conecta a una base.
- Cada tema tiene además un cuestionario de opción múltiple.
- El progreso se guarda en el navegador (`localStorage`) y se puede reiniciar
  desde el botón **Reiniciar progreso**.

## Uso

No requiere servidor: abrir `index.html` en cualquier navegador.

Para publicarlo con GitHub Pages: *Settings → Pages → branch `main`,
carpeta raíz*.
