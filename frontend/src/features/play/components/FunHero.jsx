import { FUN_CATEGORIES } from '../data/fun-resources'

function FunHero() {
  return (
    <section className="fun-hero" id="top">
      <p className="play-eyebrow">
        <span className="play-eyebrow__dot" aria-hidden="true" />
        Fun
      </p>
      <h1 className="fun-hero__title">Things worth doing.</h1>
      <p className="fun-hero__sub">
        Interesting corners of the internet — websites, experiments, games and
        rabbit holes for thinking, learning and discovering something new.
      </p>
      <p className="fun-hero__more">
        More to come: {FUN_CATEGORIES.map((category) => category.label).join(' · ')}.
      </p>
    </section>
  )
}

export default FunHero