import { M as adminApi } from './index-NOrEVVHS.js';

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 2200;
const ACCEPTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function fileStem(name) {
  return (name || 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w\u3400-\u9fff-]+/g, '-')
    .slice(0, 60) || 'image'
}

function loadWithImageElement(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        close: () => URL.revokeObjectURL(url),
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('无法读取这张图片。'));
    };
    image.src = url;
  })
}

async function loadImage(file) {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      }
    } catch {
      // Fall through to the image element for formats the browser can paint.
    }
  }
  return loadWithImageElement(file)
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

async function compressImage(file) {
  if (!file) throw new Error('请选择图片。')
  if (!ACCEPTED.has(file.type)) {
    throw new Error('只支持 JPG、PNG、WebP、GIF 图片。')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('原图太大了，请选择 15 MB 以内的图片。')
  }

  const loaded = await loadImage(file);
  try {
    const { width, height, source } = loaded;
    if (file.type === 'image/gif') {
      if (file.size > 6 * 1024 * 1024) {
        throw new Error('GIF 不能超过 6 MB，请压缩后再上传。')
      }
      return {
        blob: file,
        width,
        height,
        filename: `${fileStem(file.name)}.gif`,
      }
    }

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext('2d', { alpha: true });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, targetWidth, targetHeight);
    let blob = await canvasToBlob(canvas, 'image/webp', 0.84);
    if (!blob) blob = await canvasToBlob(canvas, 'image/png');
    if (!blob) throw new Error('浏览器无法处理这张图片。')
    if (blob.size > 6 * 1024 * 1024) {
      blob = await canvasToBlob(canvas, 'image/webp', 0.68);
    }
    if (blob.size > 6 * 1024 * 1024) {
      throw new Error('压缩后的图片仍然超过 6 MB，请换一张。')
    }
    return {
      blob,
      width: targetWidth,
      height: targetHeight,
      filename: `${fileStem(file.name)}.${blob.type === 'image/png' ? 'png' : 'webp'}`,
    }
  } finally {
    loaded.close();
  }
}

async function uploadImageFile(file, alt = '') {
  const compressed = await compressImage(file);
  return adminApi.uploadMedia(compressed.blob, {
    filename: compressed.filename,
    alt: alt || fileStem(file.name).replace(/-/g, ' '),
    width: compressed.width,
    height: compressed.height,
  })
}

function imageMarkdown(item) {
  return `![${(item.alt || item.original_name || '图片').replace(/[\[\]]/g, '')}](${item.url})`
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

export { copyText as c, imageMarkdown as i, uploadImageFile as u };
