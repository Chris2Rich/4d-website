// @ts-nocheck
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const d4 = 2

function map3(tesseract: any) {
  
  const res = Array(4).fill().map(() => Array(4).fill().map(() => Array(3).fill(0)))

  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          const point4D = tesseract[i][j]
          
          const x = point4D[0] - 0.5
          const y = point4D[1] - 0.5
          const z = point4D[2] - 0.5
          const w = point4D[3] - 0.5
          
          const s = 1 / (d4 - w)
          
          res[i][j] = [
              x * s,
              y * s,
              z * s
          ]
      }
  }
  
  return res
}


function Point({ position, color = "#ffffff", size = 0.1 }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function Line({ start, end, color="#0FF" }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: color }) 

  return <line geometry={geometry} material={material}/>
}

function HyperCube({ position = [0,0,0], sv = [1,1,1], rt, display}){
  const origin = useRef([
    [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1]],
    [[0,1,0,0],[0,1,0,1],[0,1,1,0],[0,1,1,1]],
    [[1,0,0,0],[1,0,0,1],[1,0,1,0],[1,0,1,1]],
    [[1,1,0,0],[1,1,0,1],[1,1,1,0],[1,1,1,1]]
  ].map(i => i.map(rw => rw.map(n => n - 0.5))))

  const [hyper_points, setHyper_Points] = useState(origin.current)
  useFrame((state) => {
    const angle = rt.current * 0.1 * state.clock.getElapsedTime()
    setHyper_Points(origin.current.map((layer) =>
      layer.map((point) => {
        const [x, y, z, w] = point
        const newX = x * Math.cos(angle) - w * Math.sin(angle)
        const newW = x * Math.sin(angle) + w * Math.cos(angle)

        const newY = y * Math.cos(angle) - z * Math.sin(angle)
        const newZ = y * Math.sin(angle) + z * Math.cos(angle)
        
        const scale = 1 / (2 - newW)
        
        return [newX * scale + position[0], newY * scale + position[1], newZ * scale + position[2], newW]
      })
    ))
  })

  const mappedPoints = map3(hyper_points).flat().map((rw) => {return rw.map((n, index) => {return n * sv[index]})})

  const cool_page = '<!DOCTYPE html><html>  <head><title>Driphub | Trends At Your Fingertips</title><link rel="icon" href="https://image.petmd.com/files/styles/863x625/public/CANS_dogsmiling_379727605.jpg"><meta charset="UTF-8"><meta name="description" content="A new website for discovering and buying underground fashion brands"><meta name="keywords" content=""><meta name="color-scheme" content="dark"><meta name="maximum-scale" content="1.5"><meta name="minimum-scale" content="0.5"><meta name="creator" content="Driphub"><meta name="creator" content="Zacaria Technologies"><meta name="publisher" content="Zacaria Technologies"><meta name="robots" content="all"><style>:root{--background1:#1c1c1c;--background2:#474747;--background3:#777777;--surface1:#28253b;--surface2:#524f62;--surface3:#807e8c;--primary1:#444bc9;--primary2:#7670d6;--primary3:#a097e3;--secondary1:#3790de;--secondary2:#72a7e6;--secondary3:#9ec0ed;--textmain:rgb(225, 225, 225);--textmute:rgba(225, 225, 225, 0.5)}*,*::before,*::after{font-family:"Rubik Mono One",monospace;color:var(--textmain);line-height:1.4;scrollbar-width:thin;scrollbar-color:var(--primary2) var(--background2);transition-duration:500ms}*:active{transition-duration:150ms}body{display:flex;overflow-x:hidden;flex-direction:column;margin:0;background-color:var(--background1)}button{position:relative;font-size:17.5px;padding:.5em;padding-left:2em;padding-right:2em;border-radius:8px;text-align:center;background-image:linear-gradient(45deg in oklab,var(--primary1),var(--primary3));box-shadow:0 0 12px var(--primary2),5px 5px 5px #000;background:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3)) padding-box,linear-gradient(45deg in oklab,var(--primary1),var(--primary3)) border-box;border:2px solid #fff0;left:50%;transform:translate(-50%,0)}button:hover{box-shadow:0 0 12px var(--secondary2),5px 5px 5px #000;transform:scale(1.1) translate(-45.45%,0)}button:active{transform:scale(1.1) translate(-45.45%,5px);box-shadow:0 0 24px var(--secondary2)}button::after{content:" ";position:absolute;top:0;left:0;display:block;width:100%;height:100%;transform:translate(-1px,-1px);border-radius:8px;opacity:0;z-index:-1;background:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3)) padding-box,linear-gradient(45deg in oklab,var(--secondary1),var(--secondary3)) border-box;border:2px solid #fff0}button:hover::after{opacity:1}input{position:relative;font-size:17.5px;padding:.5em;padding-left:2em;padding-right:2em;border-radius:8px;text-align:center;background-image:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3));box-shadow:5px 5px 5px #000;border:0 solid #fff0;left:50%;transform:translate(-50%,0)}input:focus{outline:none}input::after{content:" ";position:absolute;top:0;left:0;display:block;width:100%;height:100%;transform:translate(-1px,-1px);border-radius:8px;opacity:0;z-index:-1;background:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3)) padding-box,linear-gradient(45deg in oklab,var(--secondary1),var(--secondary3)) border-box;border:2px solid #fff0}input:hover::after{opacity:1}img{object-fit:cover}card.border:hover{box-shadow:none}#content-main{padding:30px;overflow-x:hidden}.fade{opacity:0;transform:translate(0,70px)}.fade-complete{opacity:0;transform:scale(.01);z-index:-999}.colored{background:linear-gradient(45deg in oklab,var(--primary1),var(--primary3));background-clip:text;-webkit-text-fill-color:#fff0}.colored::before{content:attr(data-text);position:absolute;top:50%;transform:translateY(-50%);background:linear-gradient(45deg in oklab,var(--secondary3),var(--secondary1));background-clip:text;-webkit-text-fill-color:#fff0;opacity:0}.colored:hover::before{opacity:1}.glow{text-shadow:0 0 .5em var(--primary2)}.glow:hover{text-shadow:0 0 .5em var(--secondary2)}.shadowed{filter:drop-shadow(1px 1px 1px #000)}.centered{text-align:center;width:fit-content;margin:auto}.main-text{cursor:pointer;user-select:none}.main-text:hover,.hero:hover main-text{transform:scale(1.25)}.sub-text{user-select:none;color:var(--textmute)}.header-bg{z-index:-1;position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(180deg,var(--background1) 50%,var(--surface1))}.carousel{position:absolute;left:calc(30% - 42px);top:-10px;width:40%;height:80%;z-index:1;transform-style:preserve-3d}.carousel.prev{transform:translate(-350px,35px) scale(.75) rotate(-5deg);z-index:0;opacity:.5}.carousel.next{transform:translate(350px,35px) scale(.75) rotate(5deg);z-index:0;opacity:.5}.carousel-container .left-arrow{position:absolute;z-index:1;top:calc(95% - 25px);left:calc(50% - 75px);width:50px;height:50px;opacity:.6;&:hover{transform:translate(-15px,0);opacity:1}}.carousel-container .right-arrow{position:absolute;z-index:1;top:calc(95% - 25px);left:calc(50% + 25px);width:50px;height:50px;opacity:.6;&:hover{transform:translate(15px,0);opacity:1}}.carousel-container{position:relative;display:block;justify-content:center;width:calc(100%);height:600px}.catalogue{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;width:100%;height:fit-content}.catalogue card{margin-left:auto;margin-right:auto}colored-border{display:block;z-index:1;position:absolute;bottom:0;left:0;height:2px;width:100%;background-image:linear-gradient(90deg in oklab,var(--primary1),var(--primary3));box-shadow:0 0 4px var(--primary2)}divider{display:block;z-index:1;position:relative;height:2px;width:100%;margin-top:45px;margin-bottom:15px;background-image:linear-gradient(90deg in oklab,var(--background1) 20%,var(--background3) 50%,var(--background1) 80%)}search{position:relative;display:flex;height:2em;width:90%;top:0;left:5%;padding:.5em;justify-content:center;align-items:center;white-space:nowrap;text-overflow:clip;transform:scale(1);border-radius:8px;box-shadow:2px 2px 2px #000;background:linear-gradient(-15deg in oklab,var(--background3),var(--background1)) padding-box,linear-gradient(45deg in oklab,var(--primary1),var(--primary3)) border-box;border:2px solid #fff0}search::after{content:" ";position:absolute;top:0;left:0;display:block;width:100%;height:100%;transform:translate(-2px,-2px);border-radius:8px;opacity:0;z-index:-1;box-shadow:0 0 8px var(--secondary2),2px 2px 2px #000;background:linear-gradient(-15deg in oklab,var(--background3),var(--background1)) padding-box,linear-gradient(45deg in oklab,var(--secondary1),var(--secondary3)) border-box;border:2px solid #fff0}search:hover{cursor:text}search:hover::after{opacity:1}search:focus{outline:none;transform:scale(1.075)}search:focus::after{opacity:1}card{position:relative;display:block;height:550px;width:400px;min-width:300px;border-radius:8px;background-image:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3));box-shadow:10px 10px 10px #000;margin:30px;padding:10px;z-index:1;opacity:1;user-select:none}card.item{width:400px;height:fit-content;&:has(.item-img-container img:hover){cursor:zoom-in}&.zoomed{position:fixed;z-index:1000;transition-duration:350ms;top:50%;left:50%;transform:translate(-50%,-50%) scale(1.6)}}card divider{margin-top:15px;box-shadow:0 0 16px var(--primary2);background-image:linear-gradient(90deg in oklab,transparent 0%,var(--primary1) 15%,var(--primary3) 85%,transparent 100%)}card divider::before{content:" ";display:block;position:absolute;height:100%;width:100%;top:0;left:0;opacity:0;z-index:1;background-image:linear-gradient(90deg in oklab,transparent 0%,var(--secondary3) 15%,var(--secondary1) 85%,transparent 100%)}card img.splash{position:absolute;top:50%;left:50%;width:95%;height:95%;border-radius:8px;transform:translate(-50%,-50%);box-shadow:2px 2px 2px #000;background:linear-gradient(45deg in oklab,var(--background3),var(--background1)) border-box;border:2px solid #fff0}card.item .main-text:hover{text-decoration:underline}card.item .item-img-container{position:relative;display:flex;justify-content:center;height:200px;width:95%;margin-top:5px;left:calc(2.5% - 2px)}card.item .item-tag-container{position:relative;display:flex;flex-direction:row;height:40px;width:95%;margin-top:15px;left:calc(2.5% - 2px)}card.item .item-tag-container tag{position:relative;display:flex;flex-direction:row;flex:1;max-width:calc(33% - 10px);transform:scale(1);border-radius:8px;box-shadow:2px 2px 2px #000;background:linear-gradient(-15deg in oklab,var(--background3),var(--background1)) padding-box,linear-gradient(45deg in oklab,var(--primary1),var(--primary3)) border-box;border:2px solid #fff0;margin-inline:5px}card.item .item-tag-container tag::after{content:" ";position:absolute;top:0;left:0;display:block;width:100%;height:100%;transform:translate(-1px,-1px);border-radius:8px;opacity:0;z-index:-1;box-shadow:0 0 8px var(--secondary2),2px 2px 2px #000;background:linear-gradient(-15deg in oklab,var(--background3),var(--background1)) padding-box,linear-gradient(45deg in oklab,var(--secondary1),var(--secondary3)) border-box;border:2px solid #fff0}card.item .item-tag-container tag:hover{cursor:pointer;transform:scale(1.075)}card.item .item-tag-container tag:hover::after{opacity:1}card.item .item-img-container img{position:relative;top:0;left:0;height:100%;width:0;flex:1;margin-inline:5px;border-radius:8px;box-shadow:2px 2px 2px #000;background:linear-gradient(45deg in oklab,var(--background3),var(--background1)) border-box;border:2px solid #fff0}card.highlight::before{content:" ";position:absolute;top:0;left:0;display:block;height:100%;width:100%;border-radius:8px;opacity:0;z-index:0;background-image:linear-gradient(45deg in oklab,var(--primary3),var(--primary1));box-shadow:0 0 4px var(--primary2)}card.highlight:hover::before{opacity:1;box-shadow:0 0 8px var(--secondary2)}card.highlight *{position:relative;z-index:1}card.border.highlight::before{border-radius:4px}card.border{box-shadow:0 0 12px var(--primary2),10px 10px 10px #000;background:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3)) padding-box,linear-gradient(45deg in oklab,var(--primary1),var(--primary3)) border-box;border:2px solid #fff0}card.border::after{content:" ";position:absolute;top:0;left:0;display:block;width:100%;height:100%;transform:translate(-1px,-1px);border-radius:8px;opacity:0;z-index:-1;box-shadow:0 0 12px var(--secondary2),10px 10px 10px #000;background:linear-gradient(-15deg in oklab,var(--surface1),var(--surface3)) padding-box,linear-gradient(45deg in oklab,var(--secondary1),var(--secondary3)) border-box;border:2px solid #fff0}card.border:hover::after{opacity:1}card.border:hover{box-shadow:none}card:hover{transform:scale(1.05) translate(0,-30px);z-index:2;.colored{background:linear-gradient(45deg in oklab,var(--primary1),var(--primary3));background-clip:text;-webkit-text-fill-color:#fff0}.colored::before{content:attr(data-text);position:absolute;top:50%;transform:translateY(-50%);background:linear-gradient(45deg in oklab,var(--secondary3),var(--secondary1));background-clip:text;-webkit-text-fill-color:#fff0;opacity:1}.glow{text-shadow:0 0 .5em var(--secondary2)}.shadowed{filter:drop-shadow(.08em .08em .01em #000)}.centered{text-align:center;width:fit-content;margin:auto}.main-text{transform:scale(1.25)}divider::before{opacity:1}divider{box-shadow:none}}</style> </head>  <body>  <script>const intervals={};let items=null,item_map=null;async function link(e,t,i){if(intervals[t]){for(let l in intervals[t])clearInterval(intervals[t][l]);intervals[t]=[]}if(null==localStorage.getItem(e)||new Date().getTime()-JSON.parse(localStorage.getItem(e))[0]>=1e3){let r=await fetch(e+"/content"),a=await r.text(),o=null;if(a.includes("<script>")){o=a.substring(a.indexOf("<script")+8,a.indexOf("/script>")-1),a=a.substring(0,a.indexOf("<script>"));let u=document.createElement("script");u.innerHTML=o,document.querySelector(t).innerHTML=a,document.querySelector(t).appendChild(u)}else document.querySelector(t).innerHTML=a;localStorage.setItem(e,JSON.stringify([new Date().getTime(),a]))}else{let p=JSON.parse(localStorage.getItem(e))[1],d=null;if(p.includes("<script>")){d=p.substring(p.indexOf("<script")+8,p.indexOf("/script>")-1),p=p.substring(0,p.indexOf("<script>"));let f=document.createElement("script");f.innerHTML=d,document.querySelector(t).innerHTML=p,document.querySelector(t).appendChild(f)}else document.querySelector(t).innerHTML=p}"true"==i&&history.pushState(null,"",e)}function shift_carousel(e,t){s=e,n=(c=Array.from((e=document.querySelector(e)).childNodes).filter(e=>"CARD"==e.nodeName)).length,pos=parseInt(e.getAttribute("data-carousel-state")),prev=0,next=0,"next"==t&&(pos==n-1?(pos=0,prev=n-1,next=1):pos==n-2?(pos=n-1,prev=n-2,next=0):(pos+=1,prev=pos-1,next=pos+1)),"prev"==t&&(0==pos?(pos=n-1,prev=n-2,next=0):1==pos?(pos=0,prev=n-1,next=1):(pos-=1,prev=pos-1,next=pos+1)),e.setAttribute("data-carousel-state",pos),c[pos].classList.remove("prev","next"),c[pos].onclick=null,c[prev].classList.remove("next"),c[prev].classList.add("prev"),c[prev].onclick=()=>{shift_carousel(s,"prev")},c[next].classList.remove("prev"),c[next].classList.add("next"),c[next].onclick=()=>{shift_carousel(s,"next")};for(let i=0;i<n;i++)i!=pos&&i!=prev&&i!=next?(c[i].classList.add("fade-complete"),c[i].classList.remove("prev","next"),c[i].onclick=null):c[i].classList.remove("fade-complete")}window.addEventListener("popstate",e=>{"/"==window.location.pathname?link("/render/","#content-main","false"):link(window.location,"#content-main","false")});</script><header style="position:sticky; top: 0px; height: 80px; margin-bottom: 40px; z-index: 999">  <div style="position:relative; width: calc(100% - 2em); padding: 10px; font-size: 20px;"><p class="main-text colored glow" data-text="Home" style="float: left;margin-left: 1.5em; margin-right: 1.5em" onmousedown="link("/render/", "#content-main", "true")">Home</p><p class="main-text" style="float: left; margin-right: 1.5em" onmousedown="link("/render/buy", "#content-main", "true")">Buy</p><!--<p class="main-text" style="float: left" onmousedown="link("/render/pricing", "#content-main", "true")">Business</p><p class="main-text colored glow" data-text="Account" style="float: right; margin-right: 1em;" onmousedown="link("/render/account", "#content-main", "true")">Account</p> --><p class="main-text" style="float: right; margin-right: 1em;" onmousedown="link("/render/contact", "#content-main", "true")">Contact</p>  </div>  <div class="header-bg"><colored-border/></div></header>  <h1 class="colored glow centered main-text" data-text="Driphub" style="font-size:35px;" onmousedown="link("/render/buy", "#content-main", "true")">Driphub</h1>  <divider></divider>  <div id="content-main" class="content-main"><h1 class="centered" style="font-size: 45px; user-select: none;">Trending</h1><h2 class="centered sub-text" style="font-size: 20px;">The latest products</h2><div id="carousel" class="carousel-container" style="margin-top: 2em" data-carousel-state="3">  <img src="https://icongr.am/material/chevron-double-left.svg?size=50&color=c8c8c8" class="left-arrow" onclick="shift_carousel("#carousel", "prev")" >  <img src="https://icongr.am/material/chevron-double-right.svg?size=50&color=c8c8c8" class="right-arrow" onclick="shift_carousel("#carousel", "next")">  <card class="border carousel">  <img src="https://picsum.photos/800/400" class="splash">  </card>  <card class="border carousel next">  <img src="https://picsum.photos/800/399" class="splash">  </card>  <card class="border carousel prev">  <img src="https://picsum.photos/800/398" class="splash">  </card>  <card class="border carousel fade-complete">  <img src="https://picsum.photos/800/397" class="splash">  </card>  <card class="border carousel fade-complete">  <img src="https://picsum.photos/800/396" class="splash">  </card>  <card class="border carousel fade-complete">  <img src="https://picsum.photos/800/395" class="splash">  </card></div><divider style="margin-top: 15px;"></divider><p class="centered" style="font-size: 25px; margin-bottom: 15px;">Search</p><search contenteditable="true" onfocus="if(this.innerHTML == "Search here:"){this.innerHTML = " "; let search_range = document.createRange(); var search_selection = window.getSelection(); search_range.setStart(this.childNodes[0], 1); search_range.collapse(true); search_selection.removeAllRanges(); search_selection.addRange(search_range);}" onblur="if(this.innerText.replace("\n", "") == 0){this.innerHTML = "Search here:"} else {tag_search()}" onkeydown="if(event.key == "Enter"){event.preventDefault(); this.blur()};" oninput="tag_search();" onpaste="event.preventDefault(); const text = event.clipboardData.getData("text/plain"); document.execCommand("insertText", false, text.replace(/\n/g, ""));">Search here:</search><div id="catalogue" class="catalogue" style="margin-top: 2em"></div><script>function tag_search(){let e=document.querySelector("search");if("Search here:"!=e.innerText){let t=e.innerText.toLowerCase().trim().split(" ");for(let s=0;s<items.length;s++)t.every(e=>item_map[s].has(e))?(items[s].style.visibility="visible",items[s].style.display=""):(items[s].style.visibility="hidden",items[s].style.display="none")}else for(let i=0;i<items.length;i++)items[i].style.visibility="visible",items[i].style.display=""}function apply_tag(e){let t=e.querySelector("span").innerText+" ";if("Search here:"==document.querySelector("search").innerText){document.querySelector("search").innerHTML=t,tag_search();return}document.querySelector("search").innerHTML.includes(t)?document.querySelector("search").innerHTML=document.querySelector("search").innerHTML.replace(t,""):document.querySelector("search").innerHTML+=t,tag_search()}function zoom(e){let t=document.querySelector("#catalogue").children,s=document.querySelector("#"+e).classList,i=s.contains("zoomed");for(let l=0;l<t.length;l++)t[l].classList.remove("zoomed");i?s.remove("zoomed"):s.add("zoomed")}function display_buy(e){let t=document.querySelector("#"+e);t.querySelector("#display_price").classList.contains("fade")?(t.querySelector("#display_price").style.display="block",t.querySelector("#buy_now").style.display="none",t.querySelector("#add_to_cart").style.display="none"):(t.querySelector("#display_price").style.display="none",t.querySelector("#buy_now").style.display="block",t.querySelector("#add_to_cart").style.display="block")}async function load_products(){let e={"t-shirts":[{"name":"Members Only","brand":"YELLYARD","tags":"","display_tags":["😃","smiley","☹️","frowny","😂","haha"],"images":["https://i.gyazo.com/7edcad5272fbdbe95d9afd94ad96548e.png","https://i.gyazo.com/e967f2e11edcb2dd4eead3d23b7d9a22.png","https://i.gyazo.com/25ffed2cde8a62ec845ce419d727d5b4.png","https://i.gyazo.com/e14a0ed2f8d5d7fe2d8fa7f613c55b2b.png","https://i.gyazo.com/a7f5f7d90166970f61a80ed6663c989c.png","https://i.gyazo.com/b506430599099eb42327da9051d82595.png","https://i.gyazo.com/7ade11626a913c051ca64a02a2049d97.png","https://i.gyazo.com/d6771fa5ebae3b01bb62bae078bfe336.png","https://i.gyazo.com/6f820faf0c4ab2186d26a8861c65de28.png","https://i.gyazo.com/40f32b57853cd060cfc5a736f0921aed.png","https://i.gyazo.com/b1374937d99efd7e081e20373778b67e.png","https://i.gyazo.com/549f8cb3d8cf19118be1b939c8e98bab.png","https://i.gyazo.com/deae06e64e1c6a8b0301e336c7a52c02.png","https://i.gyazo.com/8d9fb8b8c8f803a38451d078315187a6.png","https://i.gyazo.com/d6f8afe40571120c8b5020109ba43455.png","https://i.gyazo.com/96457e0677ed1bf4ce461b53d5e4c8b3.png"],"sizes":"s/m/l/xl/xxl","colors":["black/brown","black/pink","black/red","black/yellow","brown/pink","white/pink","white/red","white/yellow"],"description":"A T shirt that shows a great taste and a must have for for cold fits.","price":"115.00"}],"shirts":[],"trousers":[],"jeans":[],"joggers":[],"sweaters":[],"hoods":[],"tracksuits":[],"puffers":[],"jackets":[],"hats":[],"accessories":[],"shoes":[]},t=document.querySelector("#catalogue"),s=Object.keys(e);for(let i=0;i<s.length;i++)for(let l=0;l<e[s[i]].length;l++)for(let a=0;a<2*e[s[i]][l].colors.length;a+=2){let n=document.createElement("null");t.appendChild(n);let r=new TextDecoder().decode(crypto.getRandomValues(new Uint8Array(8)).map(e=>parseInt(e/16)+65));n.outerHTML=`    	<card id="${r}" class="item">      	<div style="width: 100%; display: flex">        	<p class="colored glow shadowed" data-text="${"$"+e[s[i]][l].price}" style="flex: .5; font-size: 1.5em; translate: 12.5%">${"$"+e[s[i]][l].price}</p>        	<div style="flex: 2">          	<p style="font-size: 1.2em; margin-top: 7.5px; margin-bottom: 2.5px;" class="main-text centered" onclick="apply_tag(this)">YELLYARD<span style="visibility: hidden; display: none">${e[s[i]][l].brand}</span></p>          	<p style="font-size: 1em;" class="sub-text centered">${e[s[i]][l].name}</p>        	</div>        	<div style="flex: 1; display: flex; flex-direction: column">          	<button id="buy_now" style="flex: 1; font-size: .8em; left:40%; padding-inline: 0; width: 7.5em; margin-bottom: 0.5em;">            	<img style="width: 1.125em; height: 1.125em;" src="https://icongr.am/material/cash-multiple.svg?size=50&color=c8c8c8"> Buy          	</button>          	<button id="buy_now" style="flex: 1; font-size: .8em; left:40%; padding-inline: 0; width: 7.5em; margin-bottom: 0.5em;">            	<img style="width: 1.125em; height: 1.125em;" src="https://icongr.am/material/cart-arrow-down.svg?size=50&color=c8c8c8"> Cart          	</button>        	</div>      	</div>      	<divider></divider>      	<div class="item-img-container">        	<img src="${e[s[i]][l].images[a]}" onclick="zoom(\”${r}\”)"></img>        	<img src="${e[s[i]][l].images[a+1]}" onclick="zoom(\”${r}\”)"></img>      	</div>      	<div class="item-tag-container">        	<p class="item-tags" style="visibility: hidden; flex: 0; margin: 0; font-size: 0px;">${e[s[i]][l].tags}</p>        	<tag onclick="apply_tag(this)"><p class="centered">${e[s[i]][l].display_tags[0]} <span>${e[s[i]][l].display_tags[1]}</span></p></tag>        	<tag onclick="apply_tag(this)"><p class="centered">${e[s[i]][l].display_tags[2]} <span>${e[s[i]][l].display_tags[3]}</span></p></tag>        	<tag onclick="apply_tag(this)"><p class="centered">${e[s[i]][l].display_tags[4]} <span>${e[s[i]][l].display_tags[5]}</span></p></tag>      	</div>      	<div class="centered" style="margin-top: 5px; width: 95%; height: 60px; overflow: none;">        	<p class="sub-text" style="text-align: justify">${e[s[i]][l].description}</p>      	</div>    	</card>  	`}items=document.querySelectorAll(".item"),item_map={};for(let o=0;o<items.length;o++)item_map[o]=new Set(items[o].querySelector(".item-tags").innerHTML.split("\\"))}shift_carousel("#carousel","next"),intervals["#content-main"]?intervals["#content-main"].push(setInterval(shift_carousel,15e3,"#carousel","next")):intervals["#content-main"]=[setInterval(shift_carousel,15e3,"#carousel","next")],load_products();</script></div>  <divider></divider>  <footer class="centered" style="margin-top: calc(2em - 15px); margin-bottom: 2em;">&copy 2024 -  All rights reserved Zacaria Technologies</footer></body></html>'

  return <group>
    {mappedPoints.map((coords: any, index:any, arr:any) => (
      <Point key={index} position={coords} size={0.2} color={"#AEF"}/>
    ))}
    <Line start={mappedPoints[0]} end={mappedPoints[1]}/>
    <Line start={mappedPoints[0]} end={mappedPoints[2]}/>
    <Line start={mappedPoints[0]} end={mappedPoints[4]}/>
    <Line start={mappedPoints[0]} end={mappedPoints[8]}/>
    <Line start={mappedPoints[2]} end={mappedPoints[10]}/>
    <Line start={mappedPoints[2]} end={mappedPoints[6]}/>
    <Line start={mappedPoints[2]} end={mappedPoints[3]}/>
    <Line start={mappedPoints[4]} end={mappedPoints[6]}/>
    <Line start={mappedPoints[4]} end={mappedPoints[5]}/>
    <Line start={mappedPoints[6]} end={mappedPoints[7]}/>
    <Line start={mappedPoints[8]} end={mappedPoints[10]}/>
    <Line start={mappedPoints[8]} end={mappedPoints[12]}/>
    <Line start={mappedPoints[8]} end={mappedPoints[9]}/>
    <Line start={mappedPoints[10]} end={mappedPoints[11]}/>
    <Line start={mappedPoints[10]} end={mappedPoints[14]}/>
    <Line start={mappedPoints[12]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[12]} end={mappedPoints[14]}/>
    <Line start={mappedPoints[12]} end={mappedPoints[4]}/>
    <Line start={mappedPoints[14]} end={mappedPoints[6]}/>
    <Line start={mappedPoints[14]} end={mappedPoints[15]}/>
    <Line start={mappedPoints[7]} end={mappedPoints[5]}/>
    <Line start={mappedPoints[7]} end={mappedPoints[3]}/>
    <Line start={mappedPoints[7]} end={mappedPoints[15]}/>
    <Line start={mappedPoints[5]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[5]} end={mappedPoints[1]}/>
    <Line start={mappedPoints[15]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[15]} end={mappedPoints[11]}/>
    <Line start={mappedPoints[11]} end={mappedPoints[9]}/>
    <Line start={mappedPoints[9]} end={mappedPoints[1]}/>
    <Line start={mappedPoints[1]} end={mappedPoints[3]}/>
    <Line start={mappedPoints[9]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[11]} end={mappedPoints[3]}/>

    <QHtml points={[mappedPoints[0], mappedPoints[4], mappedPoints[12], mappedPoints[8]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#FFF", color: "white", borderRadius: "100%", alignItems: "center"}}>
        <a href={"https://github.com/chris2rich"}><svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[13], mappedPoints[5], mappedPoints[1]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "blue", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Age: 17</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[12], mappedPoints[13], mappedPoints[5], mappedPoints[4]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "green", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[8], mappedPoints[0], mappedPoints[1]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "cyan", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"https://raterandoms.vercel.app"}>Face Rating Website</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[8], mappedPoints[12], mappedPoints[13]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "yellow", padding: "50px", color: "black", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"https://thecharitybutton.com/"}>Charity Website</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[4], mappedPoints[0], mappedPoints[1], mappedPoints[5]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "orange", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>GCSEs: 9999988887</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[4], mappedPoints[0], mappedPoints[2]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "magenta", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Languages: C/++, PY, JS, Go</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[7], mappedPoints[3], mappedPoints[1], mappedPoints[5]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "black", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Interests: CS, ML, FP, Quant Fin</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[2], mappedPoints[0], mappedPoints[1], mappedPoints[3]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "white", padding: "50px", color: "black", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"https://gitlab.com/personal4984242/testlang"}>My Programming Language (indev)</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[4], mappedPoints[6], mappedPoints[7], mappedPoints[5]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "turquoise", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>A Levels: Ma, FM, Phys, CS</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[7], mappedPoints[3], mappedPoints[2]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "grey", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <iframe srcDoc={cool_page}/>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[10], mappedPoints[14], mappedPoints[6], mappedPoints[2]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#D000F", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a href={"https://gitlab.com/chris2rich"}><img style={{width: "1000px", height: "1000px"}} src={"https://www.vectorlogo.zone/logos/gitlab/gitlab-tile.svg"}></img></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[3], mappedPoints[7], mappedPoints[15], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#414141", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a href={"https://leetcode.com/u/c2rdev/"}><img style={{width: "1000px", height: "1000px"}} src={"https://upload.wikimedia.org/wikipedia/commons/8/8e/LeetCode_Logo_1.png"}></img></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[7], mappedPoints[15], mappedPoints[14]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "indigo", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a href={"https://moneyviz.vercel.app/"} style={{fontSize: "150px"}}>Cloud Data Manipulation (indev)</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[3], mappedPoints[2], mappedPoints[10], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "salmon", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Dev OS: Debian 12</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[15], mappedPoints[14], mappedPoints[10], mappedPoints[11]]} rt={rt} display={display}>
      <div className="text-white bg-gradient-to-b from-blue-500 to-purple-500 drop-shadow-md shadow-indigo-500" style={{ width: "100%", height: "100%", padding: "50px", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}> 
        <a href={"/"} style={{fontSize: "150px"}}>Hypercube Portfolio Page</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[10], mappedPoints[8], mappedPoints[12], mappedPoints[14]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "navy", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
      <img style={{width: "1000px", height: "1000px"}} src={"https://upload.wikimedia.org/wikipedia/commons/8/8d/Christian_Cross_icon.svg"}></img>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[15], mappedPoints[13], mappedPoints[9], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "papayawhip", padding: "50px", color: "black", borderRadius: "75px", alignItems: "center", textAlign: "center", overflow: "scroll", scrollbarWidth: "none"}}>
        <p style={{fontSize: "150px"}}>This is html inside a panel!</p>
        <button style={{fontSize: "45px"}} className="p-2 mt-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl drop-shadow-md transition-all hover:text-yellow-400 hover:scale-105 shadow-indigo-500">Click me?</button>
        <p style={{fontSize: "45px"}}>if you wish then you can scroll but you will see lorem ipsum after a while. i dont know about how im going to keep slelling porperl y but fi uoy kan stull reed ths than u lan dpwak z resl lanfuahe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue sagittis enim, eget iaculis orci euismod vel. Quisque id neque sed libero pellentesque commodo. Maecenas ultricies tellus magna, vel malesuada erat dapibus at. Donec tincidunt quam sed risus dictum convallis. Mauris sit amet turpis dolor. Nullam fringilla bibendum dui pretium dictum. Nullam porttitor semper felis, et aliquam ex suscipit quis. Cras in velit consectetur, finibus leo sit amet, consectetur enim. Aenean consequat justo sed est dignissim hendrerit hendrerit sed mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer quis molestie nibh. Donec nibh dolor, interdum eu metus nec, gravida facilisis nulla. Cras quis auctor metus, a elementum orci. Aliquam quis venenatis turpis. Nulla varius fringilla rhoncus. Nunc sapien mauris, imperdiet commodo tellus et, molestie egestas nunc. In eu magna maximus, mollis enim in, facilisis quam. Nulla faucibus posuere molestie. Morbi ornare fermentum odio vel vulputate. Vivamus cursus egestas sapien ac maximus. Sed at aliquet est. Praesent tincidunt orci ex, vitae condimentum libero feugiat nec. Quisque lobortis sem augue, sit amet congue justo condimentum sed. Mauris placerat porttitor velit, nec sollicitudin nisl ornare vitae. Ut dapibus orci ut elit pretium tristique. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam ac orci suscipit, porta nunc eu, commodo sem. Proin varius id diam sit amet egestas. Phasellus tempus aliquam ipsum, at malesuada massa accumsan vel. Curabitur id mollis eros. Nullam tellus velit, luctus eget malesuada ac, mollis vitae libero. Quisque in dui elementum, gravida neque et, luctus nulla. In at justo aliquam, ullamcorper ipsum non, blandit nisl.</p>
        <iframe width="100%" height="66%" src="https://www.youtube.com/embed/O6pzSeQlSbY" />
        <p style={{fontSize: "45px"}}>Dream car ^^^</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[14], mappedPoints[12], mappedPoints[13], mappedPoints[15]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "crimson", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"mailto:cz07business:gmail.com"}>Email Me!</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[11], mappedPoints[9], mappedPoints[8], mappedPoints[10]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#D000F", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
      <a href={"https://www.linkedin.com/in/chris-z-35a639324/"}><img style={{width: "1000px", height: "1000px"}} src={"https://store-images.s-microsoft.com/image/apps.31120.9007199266245564.44dc7699-748d-4c34-ba5e-d04eb48f7960.bc4172bd-63f0-455a-9acd-5457f44e4473"}></img></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[5], mappedPoints[13], mappedPoints[15], mappedPoints[7]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "seagreen", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Fluent in: English, French</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[1], mappedPoints[3], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "lightskyblue", padding: "50px", color: "black", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Target Uni: Cambridge CS</p>
      </div>
    </QHtml>
  </group>
}

function QHtml({ points, rt, display, children }) {
  const groupRef = useRef()
  const htmlRef = useRef()
  const [euler, setEuler] = useState(new THREE.Euler())
  const [scale, setScale] = useState(1)

    const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const vertices = new Float32Array(points.flat())
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    g.setIndex(new THREE.BufferAttribute(indices, 1))
    g.computeVertexNormals()
    return g
  }, [points])

    const center = useMemo(() => {
    const x = points.reduce((sum, point) => sum + point[0], 0) / 4
    const y = points.reduce((sum, point) => sum + point[1], 0) / 4
    const z = points.reduce((sum, point) => sum + point[2], 0) / 4
    return new THREE.Vector3(x, y, z);
  }, [points])

    const normal = useMemo(() => {
    const v1 = new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0]))
    const v2 = new THREE.Vector3(...points[3]).sub(new THREE.Vector3(...points[0]))
    return new THREE.Vector3().crossVectors(v1, v2).normalize()
  }, [points])

    useFrame((state) => {
    if (groupRef.current && htmlRef.current) {
            groupRef.current.position.copy(center)

            const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.lookAt(center, center.clone().add(normal), new THREE.Vector3(0, 1, 0))
      const scale = new THREE.Vector3()
      const position = new THREE.Vector3()
      const t_euler = new THREE.Euler()
      rotationMatrix.decompose(position, t_euler, scale)
      setEuler(t_euler)

      setScale(((!rt.current * 1) + (rt.current * Math.sin(0.05 * state.clock.getElapsedTime()))) * display.current)
    }
  })

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial opacity={!display.current * 0.1} color={"#8CD"} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef}>

        <Html
          ref={htmlRef}
          transform
          distanceFactor={1}
          position={[0, 0, 0]}
          rotation={euler}
          scale={scale}
          style={{
            width: "1000px",
            height: "1000px",
            transformOrigin: "center center",
            pointerEvents: "auto",
          }}
          className="blur-lg transition-all duration-200 hover:scale-110 hover:filter hover:blur-none"
        >
          {children}
        </Html>
      </group>
    </group>
  )
}


function CameraController() {
  const { camera, gl } = useThree()
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement)

      controls.minDistance = 3
      controls.maxDistance = 20
      return () => {
        controls.dispose()
      }
    },
    [camera, gl]
  )
  return null
}

function FPSLimiter({ fps }) {
  const set = useThree((state) => state.set);
  const get = useThree((state) => state.get);
  const advance = useThree((state) => state.advance);
  const frameloop = useThree((state) => state.frameloop);

  useLayoutEffect(() => {
      const initFrameloop = get().frameloop;

      return () => {
          set({ frameloop: initFrameloop });
      };
  }, []);

  useFrame((state) => {
      if (state.get().blocked) return;
      state.set({ blocked: true });

      setTimeout(() => {
          state.set({ blocked: false });

          state.advance();
      }, Math.max(0, 1000 / fps - state.clock.getDelta()));
  });

  useEffect(() => {
      if (frameloop !== 'never') {
          set({ frameloop: 'never' });
          advance();
      }
  }, [frameloop]);

  return null;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return <script>window.location.reload()</script>
    }

    return this.props.children;
  }
}

function App() {
  
  const canvasRef = useRef()


  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault()
      console.log("WebGL context lost, reloading the page.")
      throw("error")
    }

    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext('webgl2')
      if (!gl) {
        console.error("WebGL2 context not available, falling back to WebGL1.")
      } else {
        console.log("WebGL2 context created successfully.")
      }

      canvas.addEventListener('webglcontextlost', handleContextLost)
    }

    return () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
      }
    }
  }, [])

  const rt = useRef(1)
  const display = useRef(1)
  const [framerate, setframerate] = useState(30)
  
  return (
    <div className="w-full h-screen">
      <div className="absolute top-2 left-1/2 z-50 p-2 text-center rounded-xl drop-shadow-lg -translate-x-1/2 bg-neutral-300 shadow-black">
      <p className="md">This is a hypercube!<br />Some faces are clickable links.<br /> Chris2Rich: <a className="text-blue-500 underline" href="https://github.com/chris2rich">Github</a></p>
      </div>
      <div className="flex absolute bottom-2 left-1/2 z-50 items-center p-2 text-center rounded-xl drop-shadow-lg -translate-x-1/2 bg-neutral-300 shadow-black"><div><p className="md">Left Mouse: Rotate Camera<br /> Right Mouse: Move Camera</p></div>
<div className="ml-4">      <button className="p-2 mt-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl drop-shadow-md transition-all hover:text-yellow-400 hover:scale-105 shadow-indigo-500" onClick={() => {rt.current = (rt.current == 0)}}>Toggle Rotation</button><br />
<button className="p-2 mt-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl drop-shadow-md transition-all shadow-indigo-500 hover:text-yellow-400 hover:scale-105" onClick={() => {display.current = (display.current == 0)}}>Toggle Panels</button>
</div>
      </div>
      <div className="flex absolute bottom-2 left-1/2 z-50 items-center p-2 text-center rounded-xl drop-shadow-lg translate-x-48 bg-neutral-300 shadow-black">
        <p>Current FPS: {framerate}</p>
        <input type={"range"} min={0} max={59} step={1} onChange={(e) => {setframerate(e.target.value)}} className="accent-indigo-500 hover:accent-indigo-700"></input>
      </div>
        <ErrorBoundary>
        <Canvas camera={{ position: [3, 3, 3], fov: 75 }} style={{ background: "#212121" }} frameloop={"demand"} ref={canvasRef}>
        <FPSLimiter fps={framerate} />
        <CameraController />
        <ambientLight intensity={1} />
        <HyperCube sv={[25,25,25]} position={[.5,.5,.5]} rt={rt} display={display}/>
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

export default App
