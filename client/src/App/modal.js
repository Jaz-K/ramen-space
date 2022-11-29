export default function Modal({onClick, onClose}){
    
    return(
        <section className="modal">
            <button onClick={onClose}>x</button>
            <h1>Upload New Avatar</h1>
            
            <form onClick={onClick}>
                <label>
                    <input type="file" id="image" accept="image/*" name="picture..."/>
                </label>
                <button>Upload Avatar</button>
            </form>
        </section>
    )
}