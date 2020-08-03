<?php
namespace Subhh\Hosfindfacetviews\ViewHelpers;
/*
 * This file belongs to the package "TYPO3 Fluid".
 * See LICENSE.txt that was shipped with this package.
 */

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

/**
 * Class IsLinkViewHelper
 * @package TYPO3Fluid\Fluid\ViewHelpers
 */
class IsUrlViewHelper extends AbstractViewHelper
{

    public function initializeArguments()
    {
        $this->registerArgument('string', 'string', 'String to be validated', true);
    }

    /**
     * @param array $arguments
     * @param \Closure $childClosure
     * @param RenderingContextInterface $renderingContext
     * @return boolean
     */
    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    ) {
        if (filter_var(trim($arguments['string']), FILTER_VALIDATE_URL) !== FALSE) {
            return true;
        } else {
            return false;
        }
    }

}
