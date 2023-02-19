export default function ProductCart({name, sizes, prices}) {
  return (
    <div>
      <p>{name}</p>
      <p>{sizes}</p>
      <p>{prices}</p>
      <button>Agregar</button>
    </div>
  )
}