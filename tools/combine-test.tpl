# Included in full combined file for test cases
#
#  Copyright (C) 2010 Mike Gerwitz
#
#  This file is part of ease.js.
#
#  ease.js is free software: you can redistribute it and/or modify it under the
#  terms of the GNU Lesser General Public License as published by the Free
#  Software Foundation, either version 3 of the License, or (at your option)
#  any later version.
#
#  This program is distributed in the hope that it will be useful, but WITHOUT
#  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
#  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License
#  for more details.
#
#  You should have received a copy of the GNU Lesser General Public License
#  along with this program.  If not, see <http://www.gnu.org/licenses/>.
# #

module.common = { exports: {
    require: function ( id )
    {
        return require( id );
    }
} };


function failAssertion( err )
{
    throw Error( 'Assertion failed: ' + err.toString() );
}


/**
 * Bare-bones implementation of node.js assert module
 *
 * This contains only the used assertions
 */
module.assert = { exports: {
    equal: function ( val, cmp, err )
    {
        if ( val != cmp )
        {
            failAssertion( err );
        }
    },


    strictEqual: function( val, cmp, err )
    {
        if ( val !== cmp )
        {
            failAssertion( err );
        }
    },


    notEqual: function ( val, cmp, err )
    {
        if ( val === cmp )
        {
            failAssertion( err );
        }
    },


    // dumbed down impl which works for what we use
    deepEqual: function ( val, cmp, err )
    {
        if ( val == cmp )
        {
            return;
        }

        if ( cmp instanceof Array )
        {
            var i   = 0,
                len = cmp.length;

            for ( ; i < len; i++ )
            {
                // recurse
                module.assert.exports.deepEqual( val[ i ], cmp[ i ], err );
            }

            return;
        }
        else if ( cmp instanceof Object )
        {
            for ( var i in cmp )
            {
                // recurse
                module.assert.exports.deepEqual( val[ i ], cmp[ i ], err );
            }

            return;
        }

        failAssertion( err );
    },


    ok: function ( result, err )
    {
        if ( !result )
        {
            failAssertion( err );
        }
    },


    throws: function ( test, expected, err )
    {
        try
        {
            test();
        }
        catch ( e )
        {
            if ( !( e instanceof expected ) )
            {
                failAssertion( err );
            }
        }
    },


    doesNotThrow: function ( test, not_expected, err )
    {
        try
        {
            test();
        }
        catch ( e )
        {
            if ( e instanceof not_expected )
            {
                failAssertion( err );
            }
        }
    },
} };

