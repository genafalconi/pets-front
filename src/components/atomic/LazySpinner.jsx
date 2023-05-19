import { Spinner } from "react-bootstrap";

export default function LazySpinner() {
  return (
    <>
      <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true" />
    </>
  )
}