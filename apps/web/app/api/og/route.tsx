import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "NadirTools Suite";
    
    const category = searchParams.get("category") || "Developer & Admin Tools";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            background: "linear-gradient(to bottom right, #050705, #142016)",
            padding: "80px",
            fontFamily: "sans-serif",
            border: "4px solid #DFBA6B",
          }}
        >
          {/* Top category label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(223, 186, 107, 0.15)",
              color: "#DFBA6B",
              fontSize: 32,
              fontWeight: 600,
              padding: "12px 30px",
              borderRadius: "50px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>

          {/* Main Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: "#F8FAFC",
                lineHeight: 1.1,
                letterSpacing: "-2px",
                maxWidth: "1000px",
              }}
            >
              {title}
            </div>
            
            {/* Branding / Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "30px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "8px",
                  background: "#00FFB3",
                  boxShadow: "0 0 20px #00FFB3",
                }}
              />
              <div
                style={{
                  fontSize: 32,
                  color: "#94A3B8",
                  fontWeight: 500,
                }}
              >
                NadirTools | Solitude Dark Labs
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
