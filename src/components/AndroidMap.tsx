import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import type { Coordinate, Station } from '../models';
import { formatPrice } from '../models';

export type AndroidMapHandle = { focus: (coordinate: Coordinate, zoom?: number) => void };
type Props = {
  stations: Station[];
  selectedId?: string;
  location?: Coordinate;
  route?: Coordinate[];
  styleName?: 'liberty' | 'positron';
  center?: Coordinate;
  compact?: boolean;
  onSelect?: (id: string) => void;
};

const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link href="https://unpkg.com/maplibre-gl@5.7.3/dist/maplibre-gl.css" rel="stylesheet" />
<style>
  html,body,#map{width:100%;height:100%;margin:0;overflow:hidden;background:#e6eff4}
  .station{display:flex;align-items:center;gap:4px;max-width:150px;padding:6px 9px;background:#fff;border:1px solid #d5dce8;border-radius:20px;box-shadow:0 3px 10px #02102d26;color:#02102d;font:700 11px system-ui,sans-serif;white-space:nowrap;cursor:pointer}
  .station .brand{max-width:68px;overflow:hidden;text-overflow:ellipsis;font-size:10px;font-weight:600}
  .station.selected{background:#0357ee;color:#fff;border:2px solid #fff;padding:8px 11px;z-index:4}
  .user{width:19px;height:19px;box-sizing:border-box;background:#0357ee;border:4px solid white;border-radius:50%;box-shadow:0 0 0 2px #0357ee,0 2px 7px #02102d55}
  .maplibregl-control-container .maplibregl-ctrl-attrib{font-size:10px;background:#ffffffc9}
  #error{display:none;position:absolute;left:12px;right:12px;top:12px;background:white;border-radius:12px;padding:12px;color:#02102d;font:13px system-ui,sans-serif;box-shadow:0 2px 10px #02102d33}
</style></head><body><div id="map"></div><div id="error">Map tiles could not load. Check the internet connection and reopen the map.</div>
<script src="https://unpkg.com/maplibre-gl@5.7.3/dist/maplibre-gl.js" onerror="document.getElementById('error').style.display='block'"></script>
<script>
(function(){
  var map, markers=[], userMarker, data={stations:[],selectedId:null,location:null,route:[],styleName:'liberty',center:{latitude:6.4441,longitude:3.4329},compact:false};
  var currentStyle='liberty';
  function send(message){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(message));}
  function point(c){return [c.longitude,c.latitude];}
  function clearMarkers(){markers.forEach(function(m){m.remove()});markers=[];if(userMarker){userMarker.remove();userMarker=null;}}
  function drawRoute(){
    if(!map)return;
    if(!map.isStyleLoaded()){map.once('idle',drawRoute);return;}
    var coords=(data.route||[]).map(point);
    var geometry={type:'Feature',geometry:{type:'LineString',coordinates:coords.length>1?coords:[[3.4329,6.4441],[3.4329,6.4441]]}};
    if(map.getSource('route'))map.getSource('route').setData(geometry);
    else {map.addSource('route',{type:'geojson',data:geometry});map.addLayer({id:'route-line',type:'line',source:'route',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#0357ee','line-width':5,'line-opacity':coords.length>1?0.9:0}});}
    if(map.getLayer('route-line'))map.setPaintProperty('route-line','line-opacity',coords.length>1?0.9:0);
  }
  function draw(){
    if(!map)return;
    clearMarkers();
    (data.stations||[]).forEach(function(s){
      var el=document.createElement('div');el.className='station'+(s.id===data.selectedId?' selected':'');
      var brand=document.createElement('span');brand.className='brand';brand.textContent=s.brand;
      var price=document.createElement('strong');price.textContent='₦'+s.price;
      el.appendChild(brand);el.appendChild(price);
      el.addEventListener('click',function(e){e.stopPropagation();send({type:'select',id:s.id})});
      markers.push(new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(point(s)).addTo(map));
    });
    if(data.location && !data.compact){var el=document.createElement('div');el.className='user';userMarker=new maplibregl.Marker({element:el}).setLngLat(point(data.location)).addTo(map);}
    drawRoute();
  }
  window.updateMap=function(next){
    var oldStyle=currentStyle;data=next;currentStyle=next.styleName||'liberty';
    if(!map)return;
    if(oldStyle!==currentStyle)map.setStyle('https://tiles.openfreemap.org/styles/'+currentStyle);
    else draw();
  };
  window.focusMap=function(c,zoom){if(map)map.easeTo({center:point(c),zoom:zoom||13.5,duration:420});};
  window.onerror=function(message){document.getElementById('error').style.display='block';send({type:'error',message:String(message)});};
  if(!window.maplibregl){document.getElementById('error').style.display='block';return;}
  map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/liberty',center:[3.4329,6.4441],zoom:12.3,attributionControl:false});
  map.addControl(new maplibregl.AttributionControl({compact:true}),'top-left');
  map.on('style.load',function(){draw();send({type:'ready'});});
  map.on('error',function(e){send({type:'error',message:e.error&&e.error.message||'Map tile error'});});
})();
</script></body></html>`;

export const AndroidMap = forwardRef<AndroidMapHandle, Props>(function AndroidMap({ stations, selectedId, location, route, styleName = 'liberty', center, compact = false, onSelect }, ref) {
  const webview = useRef<WebView>(null);
  const ready = useRef(false);
  const payload = useMemo(() => ({
    stations: stations.map(item => ({ id: item.id, brand: item.brand, latitude: item.latitude, longitude: item.longitude, price: formatPrice(item.pmsPrice) })),
    selectedId, location, route, styleName, center, compact,
  }), [stations, selectedId, location, route, styleName, center, compact]);
  const currentPayload = useRef(payload);
  currentPayload.current = payload;
  function update() {
    if (ready.current) webview.current?.injectJavaScript(`window.updateMap(${JSON.stringify(currentPayload.current)});true;`);
  }
  useEffect(update, [payload]);
  React.useImperativeHandle(ref, () => ({
    focus: (coordinate, zoom = 13.5) => webview.current?.injectJavaScript(`window.focusMap(${JSON.stringify(coordinate)},${zoom});true;`),
  }), []);
  function message(event: WebViewMessageEvent) {
    try {
      const data = JSON.parse(event.nativeEvent.data) as { type: string; id?: string; message?: string };
      if (data.type === 'ready') {
        ready.current = true;
        update();
        if (center) webview.current?.injectJavaScript(`window.focusMap(${JSON.stringify(center)},${compact ? 14 : 12.3});true;`);
      } else if (data.type === 'select' && data.id) onSelect?.(data.id);
      else if (data.type === 'error') console.warn('Android map:', data.message);
    } catch (error) { console.warn('Android map message:', error); }
  }
  return <View style={StyleSheet.absoluteFill}>
    <WebView ref={webview} source={{ html, baseUrl: 'https://openfreemap.org/' }} originWhitelist={['*']} javaScriptEnabled domStorageEnabled scrollEnabled={false} onMessage={message} onLoadStart={() => { ready.current = false; }} style={StyleSheet.absoluteFill} accessibilityLabel="Interactive Lagos map with filling stations" />
  </View>;
});
