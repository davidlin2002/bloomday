import type { Category } from '../../types'
import type { PlantProps } from './plant-types'
import Sunflower from './sunflower'
import Fern from './fern'
import Herb from './herb'
import Rose from './rose'
import Lavender from './lavender'

interface PlantFactoryProps extends PlantProps {
  category: Category
}

const PLANT_MAP: Record<Category, React.FC<PlantProps>> = {
  work: Sunflower,
  study: Fern,
  health: Herb,
  personal: Rose,
  creative: Lavender,
}

export default function Plant({ category, ...props }: PlantFactoryProps) {
  const PlantComponent = PLANT_MAP[category]
  return <PlantComponent {...props} />
}
