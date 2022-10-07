export const getRedirectUrl = (longUrl)=>{
    let url = longUrl
    var pattern = /^((http|https):\/\/)/;

  if(!pattern.test(url)) {
      url = "http://" + url;
  }
   return url
}

export   const getFormatedDate = (dt)=>{
    const d = new Date(dt)
    console.log(d.toLocaleDateString())
    return d.toLocaleDateString()
}