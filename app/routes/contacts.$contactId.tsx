import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getContact } from "../data"; // Importa correctamente desde tu archivo de datos
import invariant from "tiny-invariant"; // Para validar parámetros importantes

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
          )}
        </h1>
        <p>{contact.notes}</p>
        <div>
          <a href={`https://twitter.com/${contact.twitter}`}>
            @{contact.twitter}
          </a>
        </div>
      </div>
    </div>
  );
}