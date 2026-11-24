import ElsewhereHero from "./elsewhere-hero"

const settings = {
  daySrc: "https://cdn.21st.dev/assets/mirror/a6/a639af57ee941fdd518c604efb043501ad0e815dcce9f7efba850998bafa3453.mp4",
  nightSrc: "https://cdn.21st.dev/assets/mirror/4b/4badf32b0bc920a2fd1b066182eee89e98d8615f680e01fb19ff62fb56e86872.mp4",
  objectPosition: "42% 50%",
  headline: "Work from somewhere else.",
  subline: "Ambient soundscapes that follow the day — keys by morning, cicadas by night.",
}

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props }

  return (
    <ElsewhereHero
      daySrc={s.daySrc}
      nightSrc={s.nightSrc}
      objectPosition={s.objectPosition}
      headline={s.headline}
      subline={s.subline}
      signature={{
        name: "guglielmogiannattasio.exe",
        url: "https://www.guglielmogiannattasio.it",
      }}
    />
  )
}
