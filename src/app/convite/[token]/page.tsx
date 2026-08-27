import InviteExperience from "./InviteExperience";
import { supabase } from "@/lib/supabase";

type InviteGuest = {
  id: string;
  name: string;
  rsvp_status:
    | "pending"
    | "confirmed"
    | "declined";
  is_placeholder: boolean;
  dietary_restrictions:
    | string
    | null;
};

type InviteData = {
  found: boolean;
  display_name?: string;
  rsvp_deadline?: string;
  can_edit?: boolean;
  message?: string;
  guests?: InviteGuest[];
};

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitePage({
  params,
}: InvitePageProps) {
  const { token } =
    await params;

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_invite_by_token",
    {
      p_token: token,
    }
  );

  const invite =
    data as InviteData | null;

  if (
    error ||
    !invite ||
    !invite.found
  ) {
    return (
      <main
        style={{
          minHeight:
            "100svh",

          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",

          padding:
            "2rem",

          background:
            "#f6f4ee",

          color:
            "#3f4635",

          textAlign:
            "center",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,

              fontFamily:
                "var(--font-manrope)",

              fontSize:
                "0.6rem",

              fontWeight:
                700,

              letterSpacing:
                "0.28em",

              textTransform:
                "uppercase",

              opacity:
                0.55,
            }}
          >
            Convite
          </p>

          <h1
            style={{
              margin:
                "0.8rem 0 0",

              fontFamily:
                "var(--font-bodoni)",

              fontSize:
                "clamp(2.4rem, 8vw, 4rem)",

              fontWeight:
                400,

              lineHeight:
                1,
            }}
          >
            Convite não
            encontrado
          </h1>

          <p
            style={{
              maxWidth:
                "420px",

              margin:
                "1rem auto 0",

              fontFamily:
                "var(--font-cormorant)",

              fontSize:
                "1.15rem",

              lineHeight:
                1.5,

              opacity:
                0.7,
            }}
          >
            Verifique se o
            link recebido está
            completo e tente
            novamente.
          </p>
        </div>
      </main>
    );
  }

  const guests =
    invite.guests ?? [];

  return (
    <InviteExperience
      token={token}
      familyName={
        invite.display_name ??
        "Convidados"
      }
      guestCount={
        guests.length
      }
    />
  );
}