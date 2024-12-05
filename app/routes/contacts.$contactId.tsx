import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getContact, updateContact} from "../data"; // Importa correctamente desde tu archivo de datos
import invariant from "tiny-invariant"; // Para validar parámetros importantes
import { Form, useFetcher} from "@remix-run/react";
import type { FunctionComponent } from "react";

import type { ContactRecord } from "../data";

export const action = async ({ request, params }: ActionFunctionArgs) => { 
  // Validar que el parámetro contactId exista
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}


export const loader = async ({ params }: LoaderFunctionArgs) => {
  // Validar que el parámetro contactId exista
  invariant(params.contactId, "Missing contactId param");

  // Obtener el contacto desde los datos
  const contact = await getContact(params.contactId);

  // Si el contacto no existe, lanzar un error 404
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  // Devolver el contacto como respuesta JSON
  return json({ contact });
};

export default function Contact() {
  // Consumir los datos del loader
  const { contact } = useLoaderData<typeof loader>();

  // Renderizar la información del contacto
  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true": contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};