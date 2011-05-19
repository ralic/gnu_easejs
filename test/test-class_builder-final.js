/**
 * Tests final members
 *
 *  Copyright (C) 2010 Mike Gerwitz
 *
 *  This file is part of ease.js.
 *
 *  ease.js is free software: you can redistribute it and/or modify it under the
 *  terms of the GNU Lesser General Public License as published by the Free
 *  Software Foundation, either version 3 of the License, or (at your option)
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
 *  for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author  Mike Gerwitz
 * @package test
 */

var common  = require( './common' ),
    assert  = require( 'assert' ),
    builder = common.require( 'class_builder' )
;


/**
 * Methods declared as final should not be able to be overridden by subtypes.
 * Simple as that.
 */
( function testFinalMethodsCannotBeOverridenBySubtypes()
{
    var Foo = builder.build(
    {
        'final public foo': function() {},
    } );

    try
    {
        // attempt to override (should fail)
        builder.build( Foo,
        {
            'public foo': function() {},
        } );
    }
    catch ( e )
    {
        assert.ok(
            e.message.search( 'foo' ) !== -1,
            "Final error message contains name of method"
        );

        return;
    }

    assert.fail( 'Should not be able to override final methods' );
} )();


/**
 * Due to our static implementation (late static binding), the use of 'final'
 * with properties doesn't make much sense. We have to deal with different
 * problems than languages like Java that truly bind members statically. Consult
 * the documentation for rationale.
 *
 * See also const keyword.
 */
( function testFinalKeywordCannotBeUsedWithProperties()
{
    try
    {
        // attempt to define a 'final' property (should fail)
        builder.build(
        {
            'final public foo': 'bar',
        } );
    }
    catch ( e )
    {
        assert.ok(
            e.message.search( 'foo' ) !== -1,
            "Final property error message contains name of method"
        );

        return;
    }

    assert.fail( "Should not be able to use final keyword with properties" );
} )();
