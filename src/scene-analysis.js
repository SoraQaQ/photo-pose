/** 统计画面左右的亮度和边缘复杂度，用作构图参考而非可站立区域检测。 */
export function analyzePixels(data, width, height) {
  if (!data || width < 8 || height < 8) return null;
  const regions = [{sum:0, edges:0, count:0}, {sum:0, edges:0, count:0}];
  const lum = (x,y) => {const i=(y*width+x)*4;return .299*data[i]+.587*data[i+1]+.114*data[i+2];};
  for(let y=Math.floor(height*.2);y<Math.floor(height*.9)-1;y++) for(let x=1;x<width-1;x++) {
    const region=regions[x<width/2?0:1], value=lum(x,y);
    region.sum+=value;region.edges+=(Math.abs(value-lum(x+1,y))+Math.abs(value-lum(x,y+1)))/2;region.count++;
  }
  const stats=regions.map(r=>({brightness:r.sum/r.count,edges:r.edges/r.count}));
  const side=stats[0].edges<=stats[1].edges?'left':'right';
  return {side, x:side==='left'?.33:.67, brightness:(stats[0].brightness+stats[1].brightness)/2,
    edgeDifference:Math.abs(stats[0].edges-stats[1].edges), texture:(stats[0].edges+stats[1].edges)/2, regions:stats};
}
/** 根据已识别场景筛选姿势，并让不同动作类型优先进入首组。 */
export function rankPoses(library, scene) {
  const candidates=scene?library.filter(p=>p.scene===scene):library;
  const first=[], later=[], seen=new Set();
  for(const pose of candidates){const action=pose.action || pose.motion || pose.name;if(seen.has(action))later.push(pose);else {seen.add(action);first.push(pose);}}
  return first.concat(later);
}
