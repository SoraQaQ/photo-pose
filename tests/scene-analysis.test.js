import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzePixels, rankPoses } from '../src/scene-analysis.js';
import { poses, placeReference } from '../src/poses.js';

/** 生成左右具有不同纹理的测试图像。 */
function fixture(noisySide) {
 const width=96,height=96,data=new Uint8ClampedArray(width*height*4);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=(y*width+x)*4, noisy=(x<width/2?'left':'right')===noisySide, value=noisy&&((x+y)%2)?255:110;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;}
 return analyzePixels(data,width,height);
}
test('左右纹理变化会改变推荐区域',()=>{assert.equal(fixture('right').side,'left');assert.equal(fixture('left').side,'right');});
test('推荐骨架使用图像分析给出的位置',()=>{const right=fixture('left');const points=placeReference(poses[0].points,null,right);assert.ok((points[11].x+points[12].x)/2>.5);});
test('筛选场景并优先展示不同动作',()=>{const ranked=rankPoses(poses,'park');assert.ok(ranked.every(p=>p.scene==='park'));assert.ok(ranked.length>=3);assert.equal(new Set(ranked.slice(0,3).map(p=>p.action||p.motion)).size,3);});
