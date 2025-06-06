import fs from "fs"
import * as keys from '@element-plus/icons-vue'

const size = 32

const icons = JSON.parse(
  fs.readFileSync('./node_modules/@iconify-json/ep/icons.json').toString()
).icons

function svgToBase64(svgString) {
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}


/**
 * 
 * @param {string} str 
 * @returns {string}
 */
  function camelOrPascalToKebab(str) {
    return str
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2') // 处理多个连续大写的情况
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // 处理普通驼峰转换
        .toLowerCase();
  }
let res = ''
Object.keys(keys).forEach(name=>{
  const iconKebabName = camelOrPascalToKebab(name)
  const svg_path = icons[iconKebabName]
  if(!svg_path){
    console.error('找不到', name, iconKebabName)
  }else{
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${svg_path.body.replace(/currentColor/g,'#FFFFFF')}</svg>`

    /**
     * kebab 命名式组件
     */
    const kebabNameType = `    /**\n     *![${name}](${svgToBase64(svg)})\n     */\n    '${iconKebabName}': typeof import('@element-plus/icons-vue')['${name}']\n`
    /**
     * pascal 大驼峰组件
     */
    const pascalNameType = `    /**\n     *![${name}](${svgToBase64(svg)})\n     */\n    '${name}': typeof import('@element-plus/icons-vue')['${name}']\n`
    res += iconKebabName.includes('-')?pascalNameType:kebabNameType
   
  }
})

const temp = fs.readFileSync('./temp.txt').toString()
fs.writeFileSync('./element-plus_icons-vue.d.ts', temp.replace(/\[types\]/,res))


