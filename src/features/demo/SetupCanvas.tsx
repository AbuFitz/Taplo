"use client"
import * as React from 'react'
import { PagePreview } from '@/features/preview/PagePreview'

/** Contextual viewport over the actual page: changing a service shows that section; small previews keep the name in view. */
export function SetupCanvas({ src, expanded, showIdentity, look }: { src: string; expanded: boolean; showIdentity: boolean; look: string }) {
  const [frame,setFrame]=React.useState<HTMLIFrameElement|null>(null)
  const attach=React.useCallback((el:HTMLIFrameElement|null)=>setFrame(el),[])
  React.useEffect(()=>{
    if(!frame)return
    let observer:MutationObserver|undefined
    const focus=()=>{
      const doc=frame.contentDocument,win=frame.contentWindow
      if(!doc||!win)return
      const title=doc.querySelector('h1')
      const top=expanded||showIdentity?0:title?title.getBoundingClientRect().top+win.scrollY-12:0
      win.scrollTo({top:Math.max(0,top),behavior:'instant'})
    }
    const loaded=()=>{observer?.disconnect();if(frame.contentDocument?.body){observer=new MutationObserver(focus);observer.observe(frame.contentDocument.body,{childList:true,subtree:true});void frame.contentDocument.fonts.ready.then(focus)}focus()}
    loaded();frame.addEventListener('load',loaded)
    return()=>{observer?.disconnect();frame.removeEventListener('load',loaded)}
  },[frame,src,expanded,showIdentity,look])
  return <PagePreview src={src} title="Your page, live" mode="fill" chrome={false} resizeKey={expanded} testId="setup-live-page" frameRef={attach}/>
}
