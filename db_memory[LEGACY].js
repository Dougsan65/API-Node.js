import { randomUUID } from "crypto"

export class dbMemory{
    #videos = new Map()

    list(search){
        return Array.from(this.#videos.entries())
        .map((videoInfo) =>{
            const id = videoInfo[0]
            const infos = videoInfo[1]
            

            return{
                id,
                ...infos
            }
        }).filter(video =>{
            if (search){
                return video.title.includes(search)
            }
            return true 
            
        })
    }

    create(video){
        const videoID = randomUUID()

        this.#videos.set(videoID, video)
    }

    
    update(id, video){
        this.#videos.set(id, video)
    }

    
    delete(id){
        this.#videos.delete(id)
    }
}