


const cache = new Map();

export const setCache = async (key , value , ttl = 9000000000) => {
     cache.set( key , {
               value,
                expiresAt: Date.now() + ttl
    });      
    
}


export const getCache = (key) => {
    const data = cache.get(key);

    if (!data) return null;

    if(data.expiresAt < Date.now()) {
        cache.delete(key);
        return null;
    } 
    return data.value;
};




export const deleteCache = (key) => {
  cache.delete(key);
};