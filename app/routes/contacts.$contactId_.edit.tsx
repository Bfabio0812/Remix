import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "../data";

// Loader para cargar los datos del contacto
export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");

  const contact = await getContact(params.contactId);

  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ contact });
};

// Action para manejar la actualización de datos
export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");

  const formData = await request.formData();
  const updates = Object.fromEntries(formData); // Convierte el formulario a un objeto
  await updateContact(params.contactId, updates);

  return redirect(`/contacts/${params.contactId}`);
};

// Componente para la interfaz de edición
export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <Form method="post" id="contact-form">
      <p>
        <label>
          <span>Last name</span>
          <input
            type="text"
            name="last"
            defaultValue={contact.last}
            aria-label="Last name"
          />
        </label>
      </p>
      <p>
        <label>
          <span>Twitter</span>
          <input
            type="text"
            name="twitter"
            defaultValue={contact.twitter}
            placeholder="@jack"
            aria-label="Twitter"
          />
        </label>
      </p>
      <p>
        <label>
          <span>Avatar URL</span>
          <input
            type="text"
            name="avatar"
            defaultValue={contact.avatar}
            placeholder="https://example.com/avatar.jpg"
            aria-label="Avatar URL"
          />
        </label>
      </p>
      <p>
        <label>
          <span>Notes</span>
          <textarea
            name="notes"
            defaultValue={contact.notes}
            rows={6}
            aria-label="Notes"
          />
        </label>
      </p>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}