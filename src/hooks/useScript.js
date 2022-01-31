const useScript = (src, callback) => {
    const scriptId = 'easebuzzScript';
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = src;
      script.id = scriptId;
      document.body.appendChild(script);
      script.onload = () => { 
        if (callback) callback();
      };
    }
    if (existingScript && callback) callback();
  };
  export default useScript;