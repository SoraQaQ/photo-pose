import { connections } from './poses.js';
/** 在目标画布绘制关键点骨架。 */
export function drawSkeleton(ctx, points, width, height, color, mirror=false) {
 if(!points)return;
 const xy=p=>[ (mirror?1-p.x:p.x)*width,p.y*height ];
 ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=Math.max(3,Math.min(width,height)*.009);ctx.lineCap='round';
 for(const [a,b] of connections){const p=points[a],q=points[b];if(!p||!q||(p.visibility??1)<.5||(q.visibility??1)<.5)continue;const [x,y]=xy(p),[u,v]=xy(q);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(u,v);ctx.stroke();}
 for(const i of new Set(connections.flat())){const p=points[i];if(!p||(p.visibility??1)<.5)continue;const [x,y]=xy(p);ctx.beginPath();ctx.arc(x,y,Math.max(3.5,Math.min(width,height)*.012),0,Math.PI*2);ctx.fill();}
}

/** 按关键点范围居中绘制姿势，保留源图像比例且不绘制源图。 */
export function drawPoseThumbnail(ctx, points, width, height, aspect=1) {
 const ids=[...new Set(connections.flat())];
 const visible=ids.map(i=>points?.[i]).filter(p=>p && Number.isFinite(p.x) && Number.isFinite(p.y) && (p.visibility??1)>=.5);
 if(!visible.length)return;
 const minX=Math.min(...visible.map(p=>p.x))*aspect,maxX=Math.max(...visible.map(p=>p.x))*aspect;
 const minY=Math.min(...visible.map(p=>p.y)),maxY=Math.max(...visible.map(p=>p.y));
 const poseWidth=Math.max(.01,maxX-minX),poseHeight=Math.max(.01,maxY-minY);
 const scale=Math.min(width*.7/poseWidth,height*.78/poseHeight);
 const left=(width-poseWidth*scale)/2-minX*scale,top=(height-poseHeight*scale)/2-minY*scale;
 ctx.save();ctx.translate(left,top);drawSkeleton(ctx,points,aspect*scale,scale,'#4c6851');ctx.restore();
}
