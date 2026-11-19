import mountainSunrise from './data/mountain-sunrise.json' with { type: 'json' };
/** 创建单人姿势示意关键点；此数据不来自真实照片。 */
function createPose(arms = 'down', legs = 'together') {
  const p = Array.from({length:33}, () => ({x:.5,y:.5,visibility:0}));
  const set=(i,x,y)=>p[i]={x,y,visibility:1};
  set(0,.5,.14); set(11,.39,.28); set(12,.61,.28); set(23,.43,.57); set(24,.57,.57);
  const armShapes={
    down: [[.34,.41],[.32,.54],[.66,.41],[.68,.54]],
    wave: [[.31,.32],[.30,.18],[.66,.41],[.68,.54]],
    waist: [[.30,.40],[.42,.50],[.66,.41],[.68,.54]],
    open: [[.27,.34],[.17,.38],[.73,.34],[.83,.38]],
    together: [[.35,.40],[.48,.47],[.65,.40],[.52,.47]]
  };
  const [leftElbow,leftWrist,rightElbow,rightWrist]=armShapes[arms];
  set(13,...leftElbow);set(15,...leftWrist);set(14,...rightElbow);set(16,...rightWrist);
  const step=legs==='step', cross=legs==='cross';
  set(25,step?.38:.43,.73);set(26,.58,.73);
  set(27,step?.32:cross?.54:.43,.91);set(28,cross?.48:.59,.91);
  return p;
}
export const connections=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];

/** 示意素材标签仅描述画面和动作，不代表已检测到安全或真实可用空间。 */
export const poses = [
 {id:'park-1',scene:'park',name:'轻松站立',description:'身体放松，双手自然垂下，看向镜头。',points:createPose(),motion:'still',action:'站立',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'park-2',scene:'park',name:'挥手瞬间',description:'一只手轻轻抬起，另一只手自然放松。',points:createPose('wave'),motion:'still',action:'挥手',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'park-3',scene:'park',name:'向前一步',description:'向前迈出小步，身体保持自然。',points:createPose('down','step'),motion:'move',action:'迈步',framing:'full',space:'wide',source:'示意姿势'},
 {id:'park-4',scene:'park',name:'张开双臂',description:'双臂自然向两侧展开，站稳双脚。',points:createPose('open'),motion:'still',action:'展开双臂',framing:'full',space:'wide',source:'示意姿势'},
 {id:'park-5',scene:'park',name:'交脚站立',description:'双脚轻轻交叉，双手自然垂放。',points:createPose('down','cross'),motion:'still',action:'交脚站立',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'street-1',scene:'street',name:'街角漫步',description:'迈出小步，双手放松。',points:createPose('down','step'),motion:'move',action:'迈步',framing:'full',space:'wide',source:'示意姿势'},
 {id:'street-2',scene:'street',name:'自然站姿',description:'站稳身体，双手自然下垂。',points:createPose(),motion:'still',action:'站立',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'street-3',scene:'street',name:'抬手打招呼',description:'轻轻抬手，面向镜头。',points:createPose('wave'),motion:'still',action:'挥手',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'street-4',scene:'street',name:'单手叉腰',description:'一只手轻放腰侧，另一只手自然垂下。',points:createPose('waist'),motion:'still',action:'单手叉腰',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'street-5',scene:'street',name:'交脚停步',description:'双脚轻轻交叉，身体保持平衡。',points:createPose('down','cross'),motion:'still',action:'交脚站立',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'indoor-1',scene:'indoor',name:'室内自然站',description:'放松肩膀，保持舒适的站姿。',points:createPose(),motion:'still',action:'站立',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'indoor-2',scene:'indoor',name:'轻轻抬手',description:'一只手抬到头部附近。',points:createPose('wave'),motion:'still',action:'挥手',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'indoor-3',scene:'indoor',name:'室内迈步',description:'向旁边轻迈一步。',points:createPose('down','step'),motion:'move',action:'迈步',framing:'full',space:'wide',source:'示意姿势'},
 {id:'indoor-4',scene:'indoor',name:'双手自然相叠',description:'双手自然放在身前，肩膀保持放松。',points:createPose('together'),motion:'still',action:'双手相叠',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'indoor-5',scene:'indoor',name:'手放腰侧',description:'一只手放在腰侧，双脚自然站稳。',points:createPose('waist'),motion:'still',action:'单手叉腰',framing:'full',space:'narrow',source:'示意姿势'},
 {id:'mountain-sunrise',scene:'mountain',name:'山顶背影',description:'背对镜头，双手自然放松，眺望远方。',points:mountainSunrise.points,image:'/pose-images/mountain-sunrise.jpg',imageAspect:1400/933,motion:'still',action:'背影站立',framing:'full',space:'narrow',source:'摄影参考 · CC0',credit:'Aneta Ivanova',sourceUrl:'https://commons.wikimedia.org/wiki/File:Sunrise_hiking_views_(Unsplash).jpg'},
];
/** 将当前和参考关键点按躯干长度归一化，返回最需要的单条提示。 */
export function guidance(actual, reference, mirrored = false) {
 const visible=i=>actual?.[i] && (actual[i].visibility ?? 0)>.55;
 if(![11,12,23,24,25,26,27,28].every(visible)) return '请后退一点，让全身进入画面';
 const mid=(a,b,k)=>(a[k]+b[k])/2;
 const center=mid(actual[11],actual[12],'x');
 if(center<.27) return '向画面右侧移动一点';
 if(center>.73) return '向画面左侧移动一点';
 const norm=(points,i)=>{const shoulder=mid(points[11],points[12],'y'), hip=mid(points[23],points[24],'y');return (points[i].y-shoulder)/Math.max(.08,Math.abs(hip-shoulder));};
 for(const [i,label] of [[15,mirrored?'右手':'左手'],[16,mirrored?'左手':'右手']]) {
  if(visible(i)){const delta=norm(actual,i)-norm(reference,i);if(Math.abs(delta)>.55)return `${label}${delta>0?'抬高':'放低'}一点`;}
 }
 const lean=(points)=>mid(points[11],points[12],'x')-mid(points[23],points[24],'x');
 if(Math.abs(lean(actual)-lean(reference))>.13)return '身体稍微调整到参考角度';
 for(const i of [27,28]) if(visible(i) && Math.abs(norm(actual,i)-norm(reference,i))>.7)return '调整脚步，靠近参考姿势';
 return '很好，保持这个姿势';
}
/** 校验手工审核后的导入素材。 */
export function validatePose(data) {
 return Boolean(data && typeof data.name==='string' && data.name.trim() && ['park','street','indoor','mountain'].includes(data.scene) && typeof data.description==='string' && Array.isArray(data.points) && data.points.length===33 && data.points.every(p=>p && Number.isFinite(p.x) && Number.isFinite(p.y)));
}

/** 以肩部和髋部为锚点缩放参考骨架；脚被遮挡时仍可对齐躯干。 */
export function placeReference(points, person, placement, sourceAspect=1, targetAspect=sourceAspect) {
  sourceAspect = Number.isFinite(sourceAspect) && sourceAspect > 0 ? sourceAspect : 1;
  targetAspect = Number.isFinite(targetAspect) && targetAspect > 0 ? targetAspect : sourceAspect;
  const required=[11,12,23,24];
  const usable=person && required.every(i=>person[i] && Number.isFinite(person[i].x) && Number.isFinite(person[i].y) && (person[i].visibility ?? 0) >= .45);
  if (usable) {
    const mid=(a,b,k)=>(a[k]+b[k])/2;
    const targetShoulder={x:mid(person[11],person[12],'x'),y:mid(person[11],person[12],'y')};
    const targetHip={x:mid(person[23],person[24],'x'),y:mid(person[23],person[24],'y')};
    const refShoulder={x:mid(points[11],points[12],'x'),y:mid(points[11],points[12],'y')};
    const refHip={x:mid(points[23],points[24],'x'),y:mid(points[23],points[24],'y')};
    const targetTorso=Math.hypot((targetHip.x-targetShoulder.x)*targetAspect,targetHip.y-targetShoulder.y);
    const refTorso=Math.hypot((refHip.x-refShoulder.x)*sourceAspect,refHip.y-refShoulder.y);
    if(targetTorso>.025 && refTorso>.025) {
      const scale=Math.min(20,targetTorso/refTorso);
      return points.map(p=>({...p,x:targetShoulder.x+(p.x-refShoulder.x)*scale*sourceAspect/targetAspect,y:targetShoulder.y+(p.y-refShoulder.y)*scale}));
    }
  }
  const x=placement?.x ?? .38;
  return points.map(p=>({...p,x:x+(p.x-.5)*(.8/.77)*sourceAspect/targetAspect,y:.1+(p.y-.14)*(.8/.77)}));
}

