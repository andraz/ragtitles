

# Ragtitles

**Optimiza subtítulos para la ingesta de RAG**

Este módulo npm convierte los subtítulos VTT generados automáticamente por YouTube con marcas de tiempo por palabra a un formato apto para RAG al que hemos llamado _ragtitles_.

Este formato optimiza en tokens los subtítulos con marcas de tiempo para que sean adecuados para su uso con sistemas de Generación Aumentada por Recuperación (RAG) y puedan inyectarse directamente en el contexto de un prompt de LLM, manteniendo al mismo tiempo la relación 1:1 de palabras con las marcas de tiempo del video, con fines de referencia y reproducción.

## Instalación

```bash
npm install ragtitles
```

## Uso

### Ingesta de datos

```javascript
import convert from 'ragtitles'

const vttData = `WEBVTT
Kind: captions
Language: en

00:00:00.160 --> 00:00:02.350 align:start position:0%

lost<00:00:00.520><c> another</c><00:00:00.880><c> colony</c><00:00:01.240><c> to</c><00:00:01.439><c> Raiders</c><00:00:02.120><c> let's</c>

00:00:02.350 --> 00:00:02.360 align:start position:0%
lost another colony to Raiders let's


00:00:02.360 --> 00:00:04.269 align:start position:0%
lost another colony to Raiders let's
make<00:00:02.520><c> sure</c><00:00:02.879><c> the</c><00:00:03.040><c> next</c><00:00:03.280><c> one</c><00:00:03.520><c> doesn't</c><00:00:03.840><c> suffer</c>

00:00:04.269 --> 00:00:04.279 align:start position:0%
make sure the next one doesn't suffer


00:00:04.279 --> 00:00:06.789 align:start position:0%
make sure the next one doesn't suffer
the<00:00:04.520><c> same</c><00:00:04.839><c> fate</c><00:00:05.279><c> shall</c><00:00:05.640><c> we</c><00:00:06.040><c> today</c><00:00:06.399><c> we're</c><00:00:06.680><c> going</c>

00:00:06.789 --> 00:00:06.799 align:start position:0%
the same fate shall we today we're going

`

const convertedData = convert(vttData)
```

### Los datos por defecto son un array para una ingesta apta para RAG

```js
console.log(convertedData)
```

```json
[
  { "time": 0, "text": "lost another colony to Raiders let's" },
  { "time": 2, "text": "make sure the next one doesn't suffer" },
  { "time": 4, "text": "the same fate shall we today we're going" }
]
```

### Puede convertirse rápidamente a una cadena para una ingesta directa en el contexto del prompt

```js
const stringData = convertedData.map((d) => `${d.time} ${d.text}`)
console.log(stringData.join('\n'))
```

```
0 lost another colony to Raiders let's
2 make sure the next one doesn't suffer
4 the same fate shall we today we're going
```

## Cómo funciona

La función `convert` toma datos VTT sin procesar como entrada y devuelve un array de objetos, donde cada objeto representa una oración con su marca de tiempo correspondiente en segundos. Este formato es más conciso y más fácil de procesar para los sistemas RAG.

## Obtención de los datos VTT

Usa `yt-dlp` en la terminal.

Si `yt-dlp` no está instalado globalmente en tu sistema, usa `python -m yt_dlp` o instálalo con `pip install yt-dlp`.

Simplemente reemplaza el enlace con uno que hayas copiado de YouTube:

```bash
python -m yt_dlp https://www.youtube.com/watch?v=qrbhlNPSwzY --write-auto-subs --skip-download
```

### Codespace de DevContainer

Si abres este proyecto en un DevContainer, `yt-dlp` se instala automáticamente para ti.

Para abrir este proyecto en un DevContainer, simplemente haz clic en el botón verde Code en la esquina superior derecha de la primera página del repositorio, luego selecciona "Create codespace on main". Esto creará un nuevo DevContainer propio para ti. Se ejecuta dentro de una máquina virtual que viene gratis con tu cuenta de GitHub.

## Utilidad de línea de comandos

Puedes ejecutar el código directamente utilizando la utilidad `cli.js`.

Tomará una ruta de archivo como argumento e imprimirá los datos convertidos en la consola. Si le pasas una URL de YouTube, descargará los subtítulos y los convertirá.

Esto funcionará sin necesidad de configuración previa en el codespace de DevContainer como se mencionó anteriormente, incluso cuando se inicia desde tu propio navegador.

### Con archivo VTT

Si descargaste el archivo tú mismo, pasa el nombre del archivo en el comando:

```bash
npx tsx cli.ts filename.vtt
```

### Sin archivo VTT

Si deseas descargar los subtítulos de YouTube automáticamente, simplemente pasa la URL como un argumento:

```bash
npx tsx cli.ts https://www.youtube.com/watch?v=RuVS7MsQk4Y
```

Agregar el parámetro time hará que todas las líneas tengan como prefijo un valor entero de segundos desde el inicio del video.

```bash
npx tsx cli.ts https://www.youtube.com/watch?v=RuVS7MsQk4Y --time
```

### Ejemplo con marcas de tiempo

Imprime los primeros 10 ragtitles del video:

```bash
npx tsx cli.ts https://www.youtube.com/watch?v=RuVS7MsQk4Y --time | head -n 10
```

```
0 this was the very first transistor and
2 it was made in
3 1947 by 1978 the industry had Advanced
6 to integrated circuits with features
9 just one micrometer large that's 50
12 times smaller than a human hair and was
14 done on a machine that cost about $2
16 million I want to replicate that
18 capability in my own shop so I'm going
21 to build a photolithography machine with
```

Puedes eliminar todo lo que esté después del carácter pipe `|` en el comando para obtener la salida completa.

### Ejemplo de fragmento de texto poco tiempo después del inicio del video

Para eliminar los segundos al inicio de cada línea, removemos el parámetro `--time`.

Usamos una combinación de `tail` y `head` para obtener un fragmento de texto que ocurre poco tiempo después del inicio del video.

Agregamos `tr` para eliminar los saltos de línea y obtener una sola línea de texto.

```bash
npx tsx cli.ts https://www.youtube.com/watch?v=RuVS7MsQk4Y | head -n 50 | tail -n 20 | tr '\n' ' '
```

```
sensitive resin that's used in SLA printers or the resist that's used to manufacture pcbs the only difference really is in size chips are very small and so the pattern we put on the chip also has to be really small I've dealt with photo lithography a little bit in the past and the Machine I made was well charitably it wasn't very good in fact it was basically unusable other than as a demonstration I've also done some Electron Beam lithography in the past and it's perfect for really small features I've been working on some vacuum transistors that have gaps just a few hundred nanometers wide but my machine isn't really designed for patterning large areas so if you watch my DIY camera sensor video you'll have seen all the issues I had wit
```

Puedes ajustar los números como desees para simplificar la entrega rápida de exactamente la cantidad de contexto que necesitas.

## Uso práctico

Podemos redirigir la salida a un archivo txt simple y luego abrirlo en VSCode con una simple línea de comando:

```bash
npx tsx cli.ts https://www.youtube.com/watch?v=RuVS7MsQk4Y --time > tmp.txt && code tmp.txt
```

Solicitando al modelo `gemini-1.5-pro-exp-0801` (https://aistudio.google.com/) con:

```
using the provided seconds offset prefixed transcript, find the most interesting parts of the video and give me the approximate minute in the video I should focus on and topic in that minute

0 this was the very first transistor and
2 it was made in
3 1947 by 1978 the industry had Advanced
[... rest of transcript ...]
```

utilizará ~14_000 tokens acumulados, este número incluye la respuesta a continuación (~600 tokens).

---

Aquí hay algunas de las partes más interesantes del video, con marcadores de minutos aproximados y temas:

- **Minuto 1: Introducción y objetivo del proyecto:** El creador explica su objetivo de construir una máquina de fotolitografía capaz de producir características de 1 micra, replicando la tecnología de 1978. Esto prepara el escenario para todo el video.
- **Minuto 4: Fotolitografía explicada:** Una explicación clara y concisa de la fotolitografía, el proceso central para crear circuitos integrados. Esto es crucial para comprender el propósito de la máquina que se está construyendo.
- **Minuto 8: Análisis detallado del DMD (Dispositivo de Microrreflejos Digitales):** El creador se adentra en los detalles específicos de usar un chip DMD de un proyector DLP como el corazón de su sistema de litografía sin máscara. Es un detalle técnico fascinante.
- **Minuto 14: Construcción en chapa metálica y desafíos:** El video muestra el ensamblaje del marco de la máquina con chapa metálica cortada por láser, destacando los desafíos y la curva de aprendizaje implicados.
- **Minuto 17: Introducción del sistema de coordenadas Zaber XY:** Se muestra la increíble precisión y velocidad del sistema Zaber XY. Este es un componente clave que permite la precisión del proyecto.
- **Minuto 21: Primeras exposiciones de prueba y resultados SEM:** El entusiasmo por los primeros resultados de la prueba es palpable, seguido por el análisis de resultados mixtos bajo un microscopio electrónico de barrido.
- **Minuto 25: Solución de problemas e inexactitudes mecánicas:** El creador soluciona meticulosamente problemas de enfoque y alineación, mostrando el proceso iterativo de la ingeniería.
- **Minuto 30: Plan B - Sistema de proyección de máscara:** Se explica el cambio de estrategia para construir un sistema de proyección de máscara separado, ofreciendo una visión de las complejidades de lograr una mayor resolución.
- **Minuto 34: Construcción del sistema de proyección de máscara:** Se detallan la construcción de la segunda máquina, utilizando una lente reductora Zeiss vintage.
- **Minuto 36: Diseño innovador de fuente de luz UV:** El uso ingenioso por parte del creador de modificadores de luz de película delgada para crear una fuente de luz UV cuasi colimada es un punto destacado.
- **Minuto 40: Rediseño de la óptica de alineación:** Las dificultades y el rediseño final de la óptica de alineación demuestran la persistencia requerida en un proyecto de este tipo.
- **Minuto 44: Resultados finales y victoria calificada:** La creación exitosa de características de 2 micras utilizando el sistema de dos máquinas es una conclusión satisfactoria, a pesar de no alcanzar completamente el objetivo de 1 micra.

Este desglose debería ayudarte a navegar por el video y centrarte en los segmentos más relevantes para tus intereses. ¡Disfrútalo!

## Filtrado de spam

Ragtitles filtra el spam automáticamente cuando se usa con una URL de YouTube.

Permitir que texto irrelevante entre en nuestra canalización aumentará nuestros costos de tokens, llenará nuestro sistema RAG de basura irrelevante y engañará al LLM con ruido inútil cuando se copie en línea en el contexto.

Podemos verificar dónde aparece el spam en el video con:

```bash
$ npx tsx src/sponsorblock.ts https://www.youtube.com/watch?v=UPrkC1LdlLY
```

```json
[
  {
    "category": "preview",
    "start": 0,
    "end": 7
  },
  {
    "category": "preview",
    "start": 68,
    "end": 74
  },
  {
    "category": "selfpromo",
    "start": 296,
    "end": 323
  },
  {
    "category": "selfpromo",
    "start": 861,
    "end": 876
  },
  {
    "category": "preview",
    "start": 1233,
    "end": 1238
  },
  {
    "category": "sponsor",
    "start": 1279,
    "end": 1326
  },
  {
    "category": "preview",
    "start": 1483,
    "end": 1489
  },
  {
    "category": "selfpromo",
    "start": 1516,
    "end": 1529
  },
  {
    "category": "filler",
    "start": 1864,
    "end": 1868
  },
  {
    "category": "outro",
    "start": 1935,
    "end": 1940
  }
]
```

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request si tienes alguna sugerencia o mejora.

## Ejecutar pruebas

```bash
npm test
```

## Licencia

MIT

Puedes hacer lo que desees, pero siempre se agradece un agradecimiento en tu readme.
