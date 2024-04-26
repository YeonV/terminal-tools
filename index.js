import chalk from 'chalk'

/**
 * Displays a formatted table in the terminal.
 *
 * @param {Object} options - The options for the table.
 * @param {string} [options.title='Welcome to NextWS'] - The title of the table.
 * @param {string} [options.subtitle='NextJS + Websocket + Strapi -- Dockerized'] - The subtitle of the table.
 * @param {Object} [options.content={ Name: 'NextWS', Icon: 'default', Color: 'default' }] - The main content of the table.
 * @param {Object} [options.footerHeaders={ Service: 'URL' }] - The headers for the footer of the table.
 * @param {Object} [options.footer={ 'NextJS - prod': 'http://localhost:3100', 'NextJS - dev': 'http://localhost:3101', 'Strapi': 'http://localhost:1337' }] - The footer content of the table.
 * @param {string} [options.afterText='by Blade'] - The text to display after the table.
 * @param {string} [options.borderTop='┌─┐'] - The characters to use for the top border of the table.
 * @param {string} [options.borderMid='├─┤'] - The characters to use for the middle border of the table.
 * @param {string} [options.borderBot='└─┘'] - The characters to use for the bottom border of the table.
 * @param {Function} [options.bColor=chalk.dim.grey] - The color function for the border.
 * @param {Function} [options.titleColor=chalk.bold.red] - The color function for the title.
 * @param {Function} [options.subtitleColor=chalk.grey] - The color function for the subtitle.
 * @param {Function} [options.contentKeyColor=chalk.white] - The color function for the keys in the content.
 * @param {Function} [options.contentValueColor=chalk.bold.yellow] - The color function for the values in the content.
 * @param {Function} [options.footerHeaderKeyColor=chalk.grey] - The color function for the keys in the footer headers.
 * @param {Function} [options.footerHeaderValueColor=chalk.grey] - The color function for the values in the footer headers.
 * @param {Function} [options.footerKeyColor=chalk.white] - The color function for the keys in the footer.
 * @param {Function} [options.footerValueColor=chalk.yellow] - The color function for the values in the footer.
 * @param {Function} [options.afterTextColor=chalk.dim.grey] - The color function for the after text.
 */

function getColor(input) {
  if (typeof input === 'string') {
    const parts = input.split('.')
    if (parts[0] === 'chalk') {
      parts.shift()
    }
    let color = chalk
    for (let part of parts) {
      color = color[part]
    }

    return color
  } else {
    return input
  }
}

export function logTable({
  title = 'Welcome to NextWS',
  subtitle = 'NextJS + Websocket + Strapi -- Dockerized',
  content = {
    Name: 'NextWS',
    Icon: 'default',
    Color: 'default'
  },
  footerHeaders = { Service: 'URL' },
  footer = {
    'NextJS - prod': 'http://localhost:3100',
    'NextJS - dev': 'http://localhost:3101',
    'Strapi': 'http://localhost:1337'
  },
  afterText = 'by Blade',
  borderTop = '┌─┐',
  borderMid = '├─┤',
  borderBot = '└─┘',
  borderColor = chalk.dim.grey,
  titleColor = chalk.bold.red,
  subtitleColor = chalk.grey,
  contentKeyColor = chalk.white,
  contentValueColor = chalk.bold.yellow,
  footerHeaderKeyColor = chalk.grey,
  footerHeaderValueColor = chalk.grey,
  footerKeyColor = chalk.white,
  footerValueColor = chalk.yellow,
  afterTextColor = chalk.dim.grey
} = {}) {
  const bColor = getColor(borderColor)
  // borderColor = getColor(borderColor)
  titleColor = getColor(titleColor)
  subtitleColor = getColor(subtitleColor)
  contentKeyColor = getColor(contentKeyColor)
  contentValueColor = getColor(contentValueColor)
  footerHeaderKeyColor = getColor(footerHeaderKeyColor)
  footerHeaderValueColor = getColor(footerHeaderValueColor)
  footerKeyColor = getColor(footerKeyColor)
  footerValueColor = getColor(footerValueColor)
  afterTextColor = getColor(afterTextColor)

  const keyLength = Math.max(
    ...Object.keys(content).map((key) => key.length),
    ...Object.keys(footerHeaders).map((key) => key.length),
    ...Object.keys(footer).map((key) => key.length)
  )

  const lineLength =
    Math.max(
      title.length,
      subtitle.length,
      ...Object.entries(content).map(([key, value]) => key.length + value.length + 4),
      ...Object.entries(footerHeaders).map(([key, value]) => key.length + value.length + 4),
      ...Object.entries(footer).map(([key, value]) => key.length + value.length + 4)
    ) + 6

  const valueLength = lineLength - keyLength - 8

  function yzLine({ content = '', color = bColor, valueColor = contentValueColor, fillChar = ' ', startChar = '│', endChar = '│', isContentLine = false }) {
    let line = ''
    if (isContentLine) {
      const keyPadding = ' '.repeat(keyLength - content.key.length + 1)
      const valuePadding = ' '.repeat(valueLength - content.value.length + 1)
      line = `${bColor(startChar)}  ${color(content.key + ':')}${keyPadding} ${valueColor(content.value)}${valuePadding}${bColor(endChar)}`
    } else {
      const leftPaddingLength = Math.floor((lineLength - content.length) / 2) - 1
      const rightPaddingLength = lineLength - leftPaddingLength - content.length - 2
      line = `${bColor(startChar)}${color(fillChar.repeat(leftPaddingLength))}${color(content)}${color(fillChar.repeat(rightPaddingLength))}${bColor(endChar)}`
    }
    console.log(line)
  }

  function yzBorder(borders) {
    const [startChar, fillChar, endChar] = borders
    yzLine({ fillChar, startChar, endChar })
  }
  function yzContent(contentObj, type) {
    Object.entries(contentObj).forEach(([key, value]) => {
      yzLine({
        content: { key, value },
        isContentLine: true,
        color: type === 'content' ? contentKeyColor : type === 'footerHeaders' ? footerHeaderKeyColor : footerKeyColor,
        valueColor: type === 'content' ? contentValueColor : type === 'footerHeaders' ? footerHeaderValueColor : footerValueColor
      })
    })
  }

  console.clear()
  yzBorder(borderTop)
  yzLine({ content: title, color: titleColor })
  yzLine({ content: subtitle, color: subtitleColor })
  yzBorder(borderMid)
  yzContent(content, 'content')
  yzBorder(borderMid)
  yzContent(footerHeaders, 'footerHeaders')
  yzBorder(borderMid)
  yzContent(footer, 'footer')
  yzBorder(borderBot)
  console.log(afterTextColor(`   ${afterText}`))
}

export function yesNo(name, message) {
  return {
    type: 'select',
    name: name,
    message: chalk.bold.yellow(message),
    choices: [
      { title: 'No', description: 'No', value: false },
      { title: 'Yes', description: 'Yes', value: true }
    ]
  }
}
