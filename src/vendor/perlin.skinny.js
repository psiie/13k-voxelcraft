module.exports=($,i=0,M=Math,F=M.floor,e=256,n=-1,f=(t)=>t*t*t*(t*(t*6-15)+10),l=(a,b,t)=>(1-t)*a+t*b,p=Array(512))=>{let S=e,g=[...p];for(;i<e;i++){let v=(`${(2**31-1&(S=M.imul(48271,S+1)))/2**31}`.split('').slice(-10).join('')%e)^(i&1?S&255:((S>>8)&255));p[i]=p[i+e]=v;g[i]=g[i+e]=[[1,1],[n,1],[1,n],[n,n],[1,,1],[n,,1],[1,,n],[n,,n],[,1,1],[,n,1],[,1,n],[,n,n]].map(b=>new class{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}d(x,y){return this.x*x+this.y*y}}(...b))[v%12];}$.P=(x,y,X,Y,u)=>{X=F(x),Y=F(y);y-=Y;u=f(x-=X);return l(l(g[X+p[Y]].d(x,y),g[X+1+p[Y]].d(x-1,y),u),l(g[X+p[Y+1]].d(x,y-1),g[X+1+p[Y+1]].d(x-1,y-1),u),f(y))}};