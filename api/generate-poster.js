import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

registerFont(path.join(__dirname, '../../public/fonts/SourceHanSerifSC-Regular.woff'), { family: 'Source Han Serif SC' });
registerFont(path.join(__dirname, '../../public/fonts/HuawenMingTi.woff'), { family: 'Huawen Mincho' });
registerFont(path.join(__dirname, '../../public/fonts/EVA.woff'), { family: 'EVA' });

export default async (req, res) => {
    const {
        text, fontSize, fontColor, fontFamily, textAlign, lineHeight,
        bgType, bgColor, bgGradient, width, height, lightEffect, paperTexture
    } = req.body;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    if (bgType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        const colors = bgGradient.split(',');
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = fontColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';

    const lines = text.split('\n');
    const lineHeightPx = fontSize * lineHeight;
    const yStart = height / 2 - ((lines.length - 1) * lineHeightPx) / 2;

    lines.forEach((line, index) => {
        const y = yStart + index * lineHeightPx;
        const x = textAlign === 'start' ? 0 : textAlign === 'end' ? width : width / 2;
        ctx.fillText(line, x, y);
    });

    // Light Effects
    if (lightEffect === 'window') {
        // Add window light effect logic
    } else if (lightEffect === 'spotlight') {
        // Add spotlight effect logic
    }

    // Paper Texture
    if (paperTexture === 'rough' || paperTexture === 'canvas') {
        try {
            const texture = await loadImage(path.join(__dirname, `../../public/textures/${paperTexture}.jpg`));
            ctx.globalAlpha = 0.5;
            ctx.drawImage(texture, 0, 0, width, height);
        } catch (error) {
            console.error(`Failed to load texture: ${error}`);
        }
    }

    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
};
