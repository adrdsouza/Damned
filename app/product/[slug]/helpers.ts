import {
  VariableProduct,
  VariationAttribute,
  ProductAttribute,
  ProductVariation,
} from '@/graphql';

export function getDefaultAttributes(product: VariableProduct) {
  const attributes = (product.attributes?.nodes || []) as ProductAttribute[];
  const defaultAttributes = product.defaultAttributes?.nodes;

  if (defaultAttributes?.length) {
    return (defaultAttributes || []).reduce((results, attribute) => {
      const { value, label } = attribute as VariationAttribute;
      return {
        ...results,
        [label as string]: value as string,
      };
    }, {});
  }

  return attributes.reduce((results, attribute) => {
    const { label, options, variation } = attribute;
    if (!variation || !options || !options.length) {
      return results;
    }

    return {
      ...results,
      [label as string]: options[0],
    };
  }, {});
}

export function getRequiredAttributes(
  attributes: { [key: string]: string } | null,
  variation: ProductVariation | null
) {
  if (!attributes) return [];
  const variationAttributes = variation?.attributes?.nodes || [];
  return Object.entries(attributes)
    .filter(([attributeName]) => {
      return !!variationAttributes.find((variationAttribute) => {
        const { value, label } = variationAttribute as VariationAttribute;
        return !value && label === attributeName;
      });
    })
    .map(([attributeName, attributeValue]) => ({
      attributeName: attributeName.toLowerCase(),
      attributeValue,
    }));
}

export function findMatchingVariation(
  selectedAttributes: { [key: string]: string },
  variations: ProductVariation[] | null
) {
  return (
    variations &&
    variations.find(({ attributes: variationAttributes }) =>
      ((variationAttributes?.nodes as VariationAttribute[]) || [])?.every(
        ({ value, label, name }) => {
          return !value || selectedAttributes[label as string] === value;
        }
      )
    )
  );
}
